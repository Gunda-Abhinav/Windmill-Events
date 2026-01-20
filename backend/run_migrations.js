require('dotenv').config()
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function run() {
  const migrationsDir = path.join(__dirname, 'migrations')
  if (!fs.existsSync(migrationsDir)) {
    console.error('No migrations directory found at', migrationsDir)
    process.exit(1)
  }

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()
  if (!files.length) {
    console.log('No .sql migration files found')
    return
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    for (const file of files) {
      const full = path.join(migrationsDir, file)
      console.log('Running migration:', file)
      const sql = fs.readFileSync(full, 'utf8')
      // execute as a single query; if file contains multiple statements, pg will handle them
      await client.query(sql)
      console.log('Applied', file)
    }
    console.log('All migrations applied')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exitCode = 2
  } finally {
    client.release()
    await pool.end()
  }
}

run()
