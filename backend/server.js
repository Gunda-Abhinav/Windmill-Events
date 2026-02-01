// Load .env when present
require('dotenv').config()
const express = require('express')
const http = require('http')
const url = require('url')
const path = require('path')
const { z } = require('zod')
const { Pool } = require('pg')
const { renderEnquiryEmail, renderPaymentConfirmationEmail } = require('./lib/email-templates')
const { createOrder, captureOrder, getOrderDetails } = require('./lib/paypal-service')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')

const PORT = process.env.PORT || 4000
const NEXT_PORT = process.env.NEXT_PORT || 3000

// Postgres pool (using DATABASE_URL)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '50kb' }))
app.use(morgan('combined'))

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ ok: false, message: 'Please try again later' }),
})
app.use(limiter)

// Health check endpoints
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }))
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }))

// ===== EVENTS API =====

/**
 * GET /api/events
 * Returns all active events with pricing logic and banner data
 * - Filters out events past registration_deadline
 * - Calculates current price (early bird vs regular) based on current date
 * - Includes banner image as base64 data URL
 */
app.get('/api/events', async (req, res) => {
  try {
    const now = new Date()

    // Query events that are:
    // 1. Published (is_published = true)
    // 2. Active status
    // 3. Not past registration deadline (or no deadline set)
    const eventsQuery = `
      SELECT
        e.id,
        e.title,
        e.slug,
        e.description,
        e.event_date,
        e.event_end_date,
        e.registration_deadline,
        e.venue,
        e.venue_address,
        e.regular_price,
        e.early_bird_price,
        e.early_bird_deadline,
        e.max_capacity,
        e.available_passes,
        e.status,
        e.contact_name,
        e.contact_email,
        e.contact_phone,
        eb.image_data,
        eb.image_type,
        eb.alt_text
      FROM events e
      LEFT JOIN event_banners eb ON e.id = eb.event_id
      WHERE e.is_published = true
        AND e.status = 'active'
        AND (e.registration_deadline IS NULL OR e.registration_deadline > $1)
      ORDER BY e.event_date ASC
    `

    const result = await pool.query(eventsQuery, [now])

    // Process events to calculate current price and format banner
    const events = result.rows.map(event => {
      // Calculate current price based on early bird deadline
      let currentPrice = parseFloat(event.regular_price)
      let isEarlyBird = false

      if (event.early_bird_price && event.early_bird_deadline) {
        const earlyBirdDeadline = new Date(event.early_bird_deadline)
        if (now <= earlyBirdDeadline) {
          currentPrice = parseFloat(event.early_bird_price)
          isEarlyBird = true
        }
      }

      // Format banner image as base64 data URL if available
      let bannerUrl = null
      if (event.image_data && event.image_type) {
        const base64 = event.image_data.toString('base64')
        bannerUrl = `data:${event.image_type};base64,${base64}`
      }

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        eventDate: event.event_date,
        eventEndDate: event.event_end_date,
        registrationDeadline: event.registration_deadline,
        venue: event.venue,
        venueAddress: event.venue_address,
        pricing: {
          currentPrice: currentPrice,
          regularPrice: parseFloat(event.regular_price),
          earlyBirdPrice: event.early_bird_price ? parseFloat(event.early_bird_price) : null,
          earlyBirdDeadline: event.early_bird_deadline,
          isEarlyBird: isEarlyBird,
        },
        capacity: {
          max: event.max_capacity,
          available: event.available_passes,
        },
        status: event.status,
        contact: {
          name: event.contact_name,
          email: event.contact_email,
          phone: event.contact_phone,
        },
        banner: {
          url: bannerUrl,
          altText: event.alt_text || event.title,
        },
      }
    })

    res.json({ ok: true, events })
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ ok: false, message: 'Failed to fetch events' })
  }
})

/**
 * GET /api/events/:slug
 * Returns a single event by slug with pricing logic
 */
app.get('/api/events/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const now = new Date()

    const eventQuery = `
      SELECT
        e.id,
        e.title,
        e.slug,
        e.description,
        e.event_date,
        e.event_end_date,
        e.registration_deadline,
        e.venue,
        e.venue_address,
        e.regular_price,
        e.early_bird_price,
        e.early_bird_deadline,
        e.max_capacity,
        e.available_passes,
        e.status,
        e.is_published,
        e.contact_name,
        e.contact_email,
        e.contact_phone,
        eb.image_data,
        eb.image_type,
        eb.alt_text
      FROM events e
      LEFT JOIN event_banners eb ON e.id = eb.event_id
      WHERE e.slug = $1
    `

    const result = await pool.query(eventQuery, [slug])

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Event not found' })
    }

    const event = result.rows[0]

    // Check if event is available for registration
    if (!event.is_published || event.status !== 'active') {
      return res.status(404).json({ ok: false, message: 'Event not available' })
    }

    if (event.registration_deadline && new Date(event.registration_deadline) < now) {
      return res.status(410).json({ ok: false, message: 'Registration deadline has passed' })
    }

    // Calculate current price
    let currentPrice = parseFloat(event.regular_price)
    let isEarlyBird = false

    if (event.early_bird_price && event.early_bird_deadline) {
      const earlyBirdDeadline = new Date(event.early_bird_deadline)
      if (now <= earlyBirdDeadline) {
        currentPrice = parseFloat(event.early_bird_price)
        isEarlyBird = true
      }
    }

    // Format banner - convert binary data to base64
    let bannerUrl = null
    if (event.image_data && event.image_type) {
      const base64 = event.image_data.toString('base64')
      bannerUrl = `data:${event.image_type};base64,${base64}`
    }

    const eventData = {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      eventDate: event.event_date,
      eventEndDate: event.event_end_date,
      registrationDeadline: event.registration_deadline,
      venue: event.venue,
      venueAddress: event.venue_address,
      pricing: {
        currentPrice: currentPrice,
        regularPrice: parseFloat(event.regular_price),
        earlyBirdPrice: event.early_bird_price ? parseFloat(event.early_bird_price) : null,
        earlyBirdDeadline: event.early_bird_deadline,
        isEarlyBird: isEarlyBird,
      },
      capacity: {
        max: event.max_capacity,
        available: event.available_passes,
      },
      status: event.status,
      contact: {
        name: event.contact_name,
        email: event.contact_email,
        phone: event.contact_phone,
      },
      banner: {
        url: bannerUrl,
        altText: event.alt_text || event.title,
      },
    }

    res.json({ ok: true, event: eventData })
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ ok: false, message: 'Failed to fetch event' })
  }
})

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(String(value || ''))
  } catch (_) {
    return String(value || '')
  }
}

// Validation schema (server-side source of truth)
const enquirySchema = z.object({
  name: z.string().min(2).transform((s) => s.trim()),
  email: z.string().email().transform((s) => s.trim()),
  phone: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : ''))
    .refine((v) => v === '' || /^\d{10}$/.test(v), {
      message: 'Phone must be exactly 10 digits (no country code)',
    }),
  eventType: z.string().min(1).transform((s) => s.trim()),
  eventDate: z.string().optional().transform((v) => (v ? v.trim() : null)),
  message: z.string().min(10).transform((s) => s.trim()),
})

// Validation schema for event registrations
const eventRegistrationSchema = z.object({
  eventTitle: z.string().min(1).transform((s) => s.trim()),
  fullName: z.string().min(2).transform((s) => s.trim()),
  email: z.string().email().transform((s) => s.trim()),
  phone: z
    .string()
    .transform((s) => s.trim())
    .refine((v) => /^\d{10}$/.test(v), {
      message: 'Phone must be exactly 10 digits (no country code)',
    }),
  passes: z.coerce.number().int().min(1).max(10),
  acceptedLiability: z.boolean().refine((v) => v === true, {
    message: 'You must accept the terms to continue',
  }),
})

// POST /api/enquiries
app.post('/api/enquiries', async (req, res) => {
  try {
    const parsed = enquirySchema.safeParse(req.body)
    if (!parsed.success) {
      const flat = parsed.error.flatten()
      const fieldErrors = flat.fieldErrors || {}
      const errors = Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v]))
      return res.status(400).json({ ok: false, message: 'Invalid details', errors })
    }

    const data = parsed.data
    console.log('Enquiry received:', { name: data.name, email: data.email })

    // Insert into Postgres via pg
    const insertSql = `INSERT INTO "Enquiry"
      (name, email, phone, event_type, event_date, message, ip, user_agent, raw_payload, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())
      RETURNING id`
    const values = [
      data.name,
      data.email,
      data.phone || null,
      data.eventType,
      data.eventDate || null,
      data.message,
      req.ip || req.socket.remoteAddress || null,
      req.get('User-Agent') || null,
      JSON.stringify(req.body),
    ]

    let result
    try {
      result = await pool.query(insertSql, values)
    } catch (dbErr) {
      console.error('DB insert error:', dbErr)
      throw dbErr
    }
    const insertedId = result.rows[0] && result.rows[0].id
    console.log('Inserted enquiry id:', insertedId)

    // Enqueue email job into email_queue table for worker to pick up
    try {
      const subject = `New Enquiry from ${data.name}`

      // Render HTML email using Nunjucks template
      const body = renderEnquiryEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: data.eventDate,
        message: data.message,
      })

      await pool.query(
        `INSERT INTO email_queue (enquiry_id, recipient, sender, subject, body) VALUES ($1,$2,$3,$4,$5)`,
        [
          insertedId,
          process.env.ADMIN_TO || 'notifications@windmill-events.com',
          process.env.EMAIL_FROM || 'no-reply@windmill-events.com',
          subject,
          body
        ]
      )
      console.log('✅ Email job enqueued for enquiry:', insertedId)
    } catch (iqerr) {
      console.error('❌ Failed to enqueue email job:', iqerr)
    }

    return res.status(201).json({ ok: true, message: 'Success', id: insertedId })
  } catch (err) {
    console.error('enquiry error', err)
    return res.status(500).json({ ok: false, message: 'Failed to submit form' })
  }
})



// POST /api/event-registrations
app.post('/api/event-registrations', async (req, res) => {
  try {
    const parsed = eventRegistrationSchema.safeParse(req.body)
    if (!parsed.success) {
      const flat = parsed.error.flatten()
      const fieldErrors = flat.fieldErrors || {}
      const errors = Object.fromEntries(
        Object.entries(fieldErrors).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v])
      )
      return res.status(400).json({ ok: false, message: 'Invalid details', errors })
    }

    const data = parsed.data
    const normalizedTitle = safeDecodeURIComponent(data.eventTitle)

    // Lookup event from database (pricing authority)
    const eventQuery = `
      SELECT id, title, slug, event_date, venue, venue_address,
             regular_price, early_bird_price, early_bird_deadline,
             contact_name, contact_email, contact_phone
      FROM events
      WHERE title = $1
        AND is_published = true
        AND status = 'active'
        AND (registration_deadline IS NULL OR registration_deadline > now())
    `
    const eventResult = await pool.query(eventQuery, [normalizedTitle])

    if (eventResult.rows.length === 0) {
      return res.status(400).json({ ok: false, message: 'Invalid details', errors: { eventTitle: 'Event not found or registration closed' } })
    }

    const event = eventResult.rows[0]

    // Calculate current price based on early bird deadline
    let pricePerPass = parseFloat(event.regular_price)
    if (event.early_bird_price && event.early_bird_deadline) {
      const now = new Date()
      const earlyBirdDeadline = new Date(event.early_bird_deadline)
      if (now <= earlyBirdDeadline) {
        pricePerPass = parseFloat(event.early_bird_price)
      }
    }

    if (!Number.isFinite(pricePerPass) || pricePerPass <= 0) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid details',
        errors: { eventTitle: 'This event is not open for registration yet' },
      })
    }

    const totalAmount = data.passes * pricePerPass

    const insertSql = `INSERT INTO event_registrations
      (event_title, event_date, venue, contact_name, contact_phone, contact_email,
       full_name, email, phone, passes, price_per_pass, total_amount, liability_accepted,
       payment_status, raw_payload, ip, user_agent, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,$17, now())
      RETURNING id, total_amount`

    const values = [
      event.title,
      event.event_date || null,
      event.venue || null,
      event.contact_name || null,
      event.contact_phone || null,
      event.contact_email || null,
      data.fullName,
      data.email,
      data.phone,
      data.passes,
      pricePerPass,
      totalAmount,
      true,
      'pending', // payment_status
      JSON.stringify(req.body),
      req.ip || req.socket.remoteAddress || null,
      req.get('User-Agent') || null,
    ]

    const result = await pool.query(insertSql, values)
    const insertedId = result.rows[0] && result.rows[0].id
    const storedTotal = result.rows[0] && result.rows[0].total_amount

    // Create PayPal order
    const paypalResult = await createOrder({
      registrationId: insertedId,
      amount: Number(storedTotal),
      eventTitle: event.title,
      customerEmail: data.email,
      passes: data.passes,
    })

    if (!paypalResult.success) {
      console.error('Failed to create PayPal order:', paypalResult.error)
      return res.status(500).json({
        ok: false,
        message: 'Registration created but payment setup failed. Please contact support.',
        id: insertedId,
      })
    }

    // Update registration with PayPal order ID
    await pool.query(
      `UPDATE event_registrations
       SET paypal_order_id = $1, payment_status = 'processing', updated_at = now()
       WHERE id = $2`,
      [paypalResult.orderId, insertedId]
    )

    // Find approval URL from PayPal links
    const approvalUrl = paypalResult.links?.find(link => link.rel === 'approve')?.href

    return res.status(201).json({
      ok: true,
      message: 'Success',
      id: insertedId,
      totalAmount: storedTotal,
      paypalOrderId: paypalResult.orderId,
      approvalUrl,
    })
  } catch (err) {
    console.error('event registration error', err)
    return res.status(500).json({ ok: false, message: 'Failed to submit registration' })
  }
})

// POST /api/paypal/capture - Capture PayPal payment
app.post('/api/paypal/capture', async (req, res) => {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({ ok: false, message: 'Order ID is required' })
    }

    // Capture the payment
    const captureResult = await captureOrder(orderId)

    if (!captureResult.success) {
      console.error('PayPal capture failed:', captureResult.error)

      // Update registration status to failed
      await pool.query(
        `UPDATE event_registrations
         SET payment_status = 'failed', updated_at = now()
         WHERE paypal_order_id = $1`,
        [orderId]
      )

      return res.status(400).json({
        ok: false,
        message: 'Payment capture failed',
        error: captureResult.error,
      })
    }

    // Update registration with payment details
    await pool.query(
      `UPDATE event_registrations
       SET payment_status = 'completed',
           payment_method = 'paypal',
           payment_id = $1,
           payment_date = now(),
           payment_details = $2::jsonb,
           updated_at = now()
       WHERE paypal_order_id = $3`,
      [captureResult.captureId, JSON.stringify(captureResult.details), orderId]
    )

    // Get registration details
    const registration = await pool.query(
      'SELECT id, full_name, email, event_title, event_date, venue, passes, total_amount, payment_id, payment_date FROM event_registrations WHERE paypal_order_id = $1',
      [orderId]
    )

    const regData = registration.rows[0]

    // Queue confirmation email to customer
    if (regData && regData.email) {
      try {
        const emailHtml = renderPaymentConfirmationEmail({
          registrationId: regData.id,
          eventTitle: regData.event_title,
          eventDate: regData.event_date,
          venue: regData.venue,
          fullName: regData.full_name,
          passes: regData.passes,
          totalAmount: Number(regData.total_amount).toFixed(2),
          paymentId: regData.id,
          transactionId: captureResult.captureId,
          paymentDate: regData.payment_date,
        })

        await pool.query(
          `INSERT INTO email_queue (recipient, sender, subject, body, status, created_at)
           VALUES ($1, $2, $3, $4, 'pending', now())`,
          [
            regData.email,
            process.env.GMAIL_USER || 'contact@windmill-events.com',
            `Payment Confirmation - ${regData.event_title}`,
            emailHtml,
          ]
        )
        console.log(`✅ Payment confirmation email queued for ${regData.email}`)
      } catch (emailError) {
        console.error('Failed to queue confirmation email:', emailError)
        // Don't fail the request if email queueing fails
      }
    }

    return res.status(200).json({
      ok: true,
      message: 'Payment completed successfully',
      registration: regData,
      payment: {
        orderId: captureResult.orderId,
        captureId: captureResult.captureId,
        status: captureResult.status,
      },
    })
  } catch (err) {
    console.error('PayPal capture error', err)
    return res.status(500).json({ ok: false, message: 'Failed to process payment' })
  }
})

// GET /api/paypal/order/:orderId - Get PayPal order details
app.get('/api/paypal/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params

    const orderDetails = await getOrderDetails(orderId)

    if (!orderDetails.success) {
      return res.status(404).json({ ok: false, message: 'Order not found' })
    }

    return res.status(200).json({ ok: true, order: orderDetails.details })
  } catch (err) {
    console.error('Get order details error', err)
    return res.status(500).json({ ok: false, message: 'Failed to get order details' })
  }
})

// GET /api/event-registrations/:id - Get registration details
app.get('/api/event-registrations/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT id, event_title, event_date, venue, full_name, email, phone, passes,
              price_per_pass, total_amount, payment_status, payment_method, payment_id,
              paypal_order_id, payment_date, created_at
       FROM event_registrations
       WHERE id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Registration not found' })
    }

    return res.status(200).json({ ok: true, registration: result.rows[0] })
  } catch (err) {
    console.error('Get registration error', err)
    return res.status(500).json({ ok: false, message: 'Failed to get registration' })
  }
})

// Proxy GET/HEAD to Next.js
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    const targetPort = process.env.NEXT_PORT || NEXT_PORT
    const proxyOptions = {
      hostname: '127.0.0.1',
      port: targetPort,
      path: req.originalUrl,
      method: req.method,
      headers: req.headers,
    }
    const proxyReq = http.request(proxyOptions, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
      proxyRes.pipe(res, { end: true })
    })
    proxyReq.on('error', (err) => {
      console.error('proxy error', err)
      res.status(502).json({ error: 'bad_gateway' })
    })
    req.pipe(proxyReq, { end: true })
    return
  }
  next()
})

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: 'The requested endpoint does not exist',
    path: req.path
  })
})

app.listen(PORT, () => {
  console.log(`Backend (Express) listening on ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
