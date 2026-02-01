/**
 * Email Worker using Gmail SMTP with Nunjucks Templates
 *
 * This worker processes the email queue and sends emails using:
 * - Gmail SMTP (simple username + app password authentication)
 * - Nunjucks templates (Jinja2-like templating for HTML emails)
 *
 * Usage:
 *   npm run email:worker:simple
 *
 * Environment Variables Required:
 *   DATABASE_URL - PostgreSQL connection string
 *   GMAIL_USER - Your Gmail address
 *   GMAIL_APP_PASSWORD - Your Gmail App Password
 *   ADMIN_TO - Email address to receive notifications (optional, defaults to GMAIL_USER)
 */

require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const { createGmailTransport } = require('./lib/gmail-smtp')

const app = express()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
let isHealthy = false

/**
 * Fetch and lock a pending email job from the queue
 */
async function fetchAndLockJob(client) {
  const res = await client.query(
    `UPDATE email_queue
     SET status='in_progress', attempts = attempts + 1, updated_at = now()
     WHERE id = (
       SELECT id FROM email_queue
       WHERE status='pending' AND scheduled_at <= now()
       ORDER BY created_at
       FOR UPDATE SKIP LOCKED
       LIMIT 1
     )
     RETURNING *`
  )
  return res.rows[0]
}

/**
 * Main send loop - continuously processes email queue
 */
async function sendLoop() {
  let client = null
  try {
    console.log('Email worker starting - attempting database connection...')
    console.log('Database URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
    console.log('Gmail account:', process.env.GMAIL_USER || 'NOT SET')

    client = await pool.connect()
    console.log('Database connection successful!')

    console.log('Email worker started - using Gmail SMTP')

    // Try to create and verify Gmail transport, but don't crash if it fails
    let transporter = null
    let gmailReady = false

    try {
      transporter = await createGmailTransport()
      gmailReady = true
      console.log('Gmail SMTP transport ready')
    } catch (err) {
      console.error('⚠️  Gmail SMTP verification failed on startup:', err.message)
      console.log('Will retry Gmail connection on first email send attempt')
    }

    while (true) {
      // Fetch next pending job
      const job = await fetchAndLockJob(client)

      if (!job) {
        // No jobs available, wait 2 seconds before checking again
        await new Promise((r) => setTimeout(r, 2000))
        continue
      }

      try {
        // If Gmail is not ready, try to initialize it now
        if (!gmailReady) {
          console.log('Attempting to initialize Gmail SMTP transport...')
          try {
            transporter = await createGmailTransport()
            gmailReady = true
            console.log('Gmail SMTP transport ready')
          } catch (err) {
            console.error('❌ Gmail SMTP still not available:', err.message)
            // Mark job as failed and continue
            await client.query(
              `UPDATE email_queue
               SET status='failed', last_error=$1, updated_at=now()
               WHERE id=$2`,
              [String(err), job.id]
            )
            continue
          }
        }

        // Determine recipient (use ADMIN_TO if set, otherwise use job recipient)
        const toAddr = job.recipient || process.env.ADMIN_TO
        console.log(`Sending email: to=${toAddr}, subject="${job.subject}"`)

        // Prepare sender address
        const fromEmail = job.sender || process.env.EMAIL_FROM || process.env.GMAIL_USER
        const fromName = process.env.GMAIL_FROM_NAME
        const from = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail

        // Send email via Gmail SMTP
        const info = await transporter.sendMail({
          from: from,
          to: toAddr,
          subject: job.subject,
          html: job.body,
        })

        console.log(`✅ Email sent successfully: messageId=${info.messageId}`)

        // Mark email as sent in queue
        await client.query(
          `UPDATE email_queue SET status='sent', sent_at=now(), updated_at=now() WHERE id=$1`,
          [job.id]
        )

        // Update enquiry record if this was an enquiry notification
        if (job.enquiry_id) {
          await client.query(
            `UPDATE "Enquiry" SET email_sent=true, email_sent_at=now() WHERE id=$1`,
            [job.enquiry_id]
          )
          console.log(`Updated Enquiry ${job.enquiry_id} - email_sent=true`)
        }

      } catch (err) {
        console.error('❌ Failed to send email:', err.message)

        // Implement retry logic with exponential backoff
        const maxAttempts = 5
        const attempts = job.attempts
        const nextStatus = attempts >= maxAttempts ? 'failed' : 'pending'
        const delaySeconds = Math.min(60 * attempts, 3600) // Max 1 hour delay
        const scheduledAt = nextStatus === 'failed' ? 'NULL' : `now() + interval '${delaySeconds} seconds'`

        await client.query(
          `UPDATE email_queue
           SET status=$1, last_error=$2, updated_at=now(), scheduled_at=${scheduledAt}
           WHERE id=$3`,
          [nextStatus, String(err), job.id]
        )

        if (nextStatus === 'failed') {
          console.error(`Email job ${job.id} marked as FAILED after ${maxAttempts} attempts`)

          // Update enquiry with error if applicable
          if (job.enquiry_id) {
            await client.query(
              `UPDATE "Enquiry" SET email_error=$1 WHERE id=$2`,
              [String(err), job.enquiry_id]
            )
          }
        } else {
          console.log(`Email job ${job.id} will retry in ${delaySeconds} seconds (attempt ${attempts}/${maxAttempts})`)
        }
      }
    }
    } catch (err) {
      console.error('Fatal error in send loop:', err)
      throw err
    } finally {
      if (client) {
        client.release()
      }
    }
}

// Health check endpoint for Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', worker: isHealthy })
})

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Email Worker is running' })
})

// Start HTTP server for Cloud Run health checks
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Email worker HTTP server listening on port ${PORT}`)
})

// Graceful shutdown handler
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...')
  pool.end().then(() => {
    console.log('Database pool closed')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...')
  pool.end().then(() => {
    console.log('Database pool closed')
    process.exit(0)
  })
})

// Start the email processing worker in background
sendLoop().catch((err) => {
  console.error('Email worker crashed:', err)
  process.exit(1)
})

// Mark worker as healthy after first successful connection
setTimeout(() => {
  isHealthy = true
  console.log('Email worker marked as healthy')
}, 5000)

