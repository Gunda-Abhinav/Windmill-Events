require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function run() {
  try {
    console.log('Enabling pgcrypto extension...')
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    console.log('Setting default for Enquiry.id to gen_random_uuid()...')
    await pool.query('ALTER TABLE "Enquiry" ALTER COLUMN id SET DEFAULT gen_random_uuid()')
    console.log('Done')
  } catch (err) {
    console.error('fix error', err)
  } finally {
    await pool.end()
  }
}

run()
