require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function testEmailQueueing() {
  console.log('\n🧪 Testing Email Queueing After Payment Fix\n')
  console.log('=' .repeat(60))

  try {
    // Step 1: Check email queue table structure
    console.log('\n1️⃣  Checking email_queue table structure...')
    const schemaResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'email_queue' 
      ORDER BY ordinal_position
    `)
    console.log('   Columns:', schemaResult.rows.map(r => r.column_name).join(', '))

    // Step 2: Clear old test emails
    console.log('\n2️⃣  Clearing old test emails...')
    await pool.query(`DELETE FROM email_queue WHERE recipient LIKE '%test%'`)
    console.log('   ✅ Cleared')

    // Step 3: Insert a test email using the FIXED query format
    console.log('\n3️⃣  Inserting test email with FIXED format...')
    const testEmail = 'test@example.com'
    const testSubject = 'Test Payment Confirmation - Hearts and Beats'
    const testBody = '<h1>Test Email</h1><p>This is a test confirmation email.</p>'
    
    await pool.query(
      `INSERT INTO email_queue (recipient, sender, subject, body, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', now())`,
      [
        testEmail,
        process.env.GMAIL_USER || 'contact@windmill-events.com',
        testSubject,
        testBody,
      ]
    )
    console.log('   ✅ Test email inserted successfully')

    // Step 4: Verify the email was inserted
    console.log('\n4️⃣  Verifying email in queue...')
    const queueResult = await pool.query(`
      SELECT id, recipient, sender, subject, status, created_at 
      FROM email_queue 
      WHERE recipient = $1
      ORDER BY created_at DESC 
      LIMIT 1
    `, [testEmail])

    if (queueResult.rows.length > 0) {
      console.log('   ✅ Email found in queue:')
      console.table(queueResult.rows)
    } else {
      console.log('   ❌ Email NOT found in queue')
    }

    // Step 5: Check all pending emails
    console.log('\n5️⃣  All pending emails in queue:')
    const allPending = await pool.query(`
      SELECT id, recipient, subject, status, attempts, created_at 
      FROM email_queue 
      WHERE status = 'pending'
      ORDER BY created_at DESC 
      LIMIT 10
    `)
    console.table(allPending.rows)

    // Step 6: Check recent registrations with payment status
    console.log('\n6️⃣  Recent registrations with payment status:')
    const registrations = await pool.query(`
      SELECT id, full_name, email, event_title, payment_status, payment_id, created_at 
      FROM event_registrations 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.table(registrations.rows)

    console.log('\n' + '='.repeat(60))
    console.log('✅ Email queueing test completed!')
    console.log('\n📝 Next Steps:')
    console.log('   1. The email worker should pick up pending emails')
    console.log('   2. Check email worker logs for sending status')
    console.log('   3. Complete a real payment to test end-to-end flow')
    console.log('=' .repeat(60) + '\n')

  } catch (error) {
    console.error('\n❌ Error during test:', error.message)
    console.error(error)
  } finally {
    await pool.end()
  }
}

testEmailQueueing()

