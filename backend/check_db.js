require('dotenv').config()
const { Pool } = require('pg')
;(async ()=>{
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const res = await pool.query("SELECT to_regclass('public.event_registrations') as tbl")
    console.log('event_registrations exists:', res.rows[0].tbl)
  } catch (e) {
    console.error('db error', e && e.message)
  } finally {
    await pool.end()
    process.exit()
  }
})()
