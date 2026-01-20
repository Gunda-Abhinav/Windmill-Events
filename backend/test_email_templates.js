/**
 * Test Email Templates
 * 
 * This script tests the Nunjucks email templates and sends test emails.
 * 
 * Usage:
 *   node test_email_templates.js
 */

require('dotenv').config()
const { renderEnquiryEmail } = require('./lib/email-templates')
const { sendEmail } = require('./lib/gmail-smtp')

async function testEnquiryTemplate() {
  console.log('\n=== Testing Enquiry Email Template ===\n')
  
  // Sample enquiry data
  const enquiryData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '5551234567',
    eventType: 'Wedding',
    eventDate: '2026-08-15',
    message: 'Hi! I\'m planning my wedding for August 2026 and would love to discuss your event planning services. We\'re expecting around 150 guests and are looking for a venue in the downtown area. Could we schedule a consultation?',
  }
  
  try {
    // Render the template
    console.log('Rendering template...')
    const html = renderEnquiryEmail(enquiryData)
    console.log('✅ Template rendered successfully!')
    console.log(`HTML length: ${html.length} characters\n`)
    
    // Send test email
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('Sending test email...')
      const result = await sendEmail({
        to: process.env.GMAIL_USER, // Send to yourself
        subject: `[TEST] New Enquiry from ${enquiryData.name}`,
        html: html,
        replyTo: enquiryData.email,
      })
      console.log('✅ Test email sent successfully!')
      console.log(`Message ID: ${result.messageId}\n`)
      console.log('Check your inbox:', process.env.GMAIL_USER)
    } else {
      console.log('⚠️  Gmail credentials not configured - skipping email send')
      console.log('Set GMAIL_USER and GMAIL_APP_PASSWORD in .env to test sending\n')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════╗')
  console.log('║     Email Template System Test                        ║')
  console.log('╚════════════════════════════════════════════════════════╝')
  
  await testEnquiryTemplate()
  
  console.log('\n✅ All tests completed successfully!\n')
}

runTests().catch(error => {
  console.error('Test suite failed:', error)
  process.exit(1)
})

