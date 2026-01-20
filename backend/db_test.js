const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function run() {
  try {
    const res = await pool.query(`INSERT INTO "Enquiry" (name,email,phone,event_type,event_date,message,ip,user_agent,raw_payload,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now()) RETURNING id`, [
      'DB Test', 'dbtest@example.com', '1234567890', 'wedding', '2026-07-01', 'db test message', '127.0.0.1', 'test-agent', JSON.stringify({foo: 'bar'})
    ])
    console.log('Inserted id:', res.rows[0].id)
  } catch (err) {
    console.error('DB test error:', err)
  } finally {
    await pool.end()
  }
}

run()
