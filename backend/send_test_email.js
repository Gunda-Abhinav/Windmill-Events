require('dotenv').config()
const { Resend } = require('resend')

async function run() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || '')
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to: process.env.NOTIFY_EMAIL || 'abhinav6349@gmail.com',
      subject: 'Resend test',
      html: '<p>This is a test email from Resend</p>',
    })
    console.log('Resend send result:', result)
  } catch (err) {
    console.error('Resend send error:', err)
  }
}

run()
