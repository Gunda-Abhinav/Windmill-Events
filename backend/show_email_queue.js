require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

;(async ()=>{
  try{
    const res = await pool.query('SELECT id,enquiry_id,recipient,sender,status,attempts,created_at,sent_at,last_error FROM email_queue ORDER BY created_at DESC LIMIT 10')
    console.log('email_queue rows:')
    console.table(res.rows)

    const e = await pool.query('SELECT id,email_sent,email_sent_at,email_error,created_at FROM "Enquiry" ORDER BY created_at DESC LIMIT 5')
    console.log('recent Enquiry rows:')
    console.table(e.rows)
  }catch(err){
    console.error(err)
  }finally{
    await pool.end()
  }
})()
