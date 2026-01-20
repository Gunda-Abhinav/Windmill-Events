require('dotenv').config()
const { Pool } = require('pg')
const fetch = global.fetch || require('node-fetch')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function postEnquiry() {
  const payload = {
    name: 'E2E Test',
    email: 'e2e.test@example.com',
    phone: '1234567890',
    eventType: 'corporate',
    eventDate: '2026-08-01',
    message: 'E2E test message to check email_sent flag'
  }
  const resp = await fetch('http://localhost:4000/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await resp.json().catch(() => null)
  if (resp.status !== 201) {
    throw new Error('Post failed: ' + JSON.stringify(body))
  }
  return body.id
}

async function pollEmailSent(id, timeoutMs = 120000, intervalMs = 3000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const res = await pool.query('SELECT email_sent, email_sent_at FROM "Enquiry" WHERE id = $1', [id])
    if (res.rows.length > 0) {
      const row = res.rows[0]
      if (row.email_sent) return { ok: true, row }
    }
    await new Promise(r => setTimeout(r, intervalMs))
  }
  return { ok: false }
}

async function run() {
  try {
    console.log('Posting enquiry...')
    const id = await postEnquiry()
    console.log('Posted id:', id)
    console.log('Polling for email_sent... (will timeout after 2 minutes)')
    const result = await pollEmailSent(id)
    console.log('Poll result:', result)
  } catch (err) {
    console.error('E2E error:', err)
  } finally {
    await pool.end()
  }
}

run()
