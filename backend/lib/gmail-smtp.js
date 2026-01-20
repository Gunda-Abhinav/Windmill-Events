/**
 * Gmail SMTP Email Module
 * 
 * Simple module to send emails via Gmail SMTP using username and password.
 * 
 * IMPORTANT: For Gmail accounts, you need to use an "App Password" instead of your regular password.
 * 
 * Setup Instructions:
 * 1. Enable 2-Step Verification on your Google Account
 * 2. Go to https://myaccount.google.com/apppasswords
 * 3. Generate an App Password for "Mail"
 * 4. Use that 16-character password in your .env file
 * 
 * Environment Variables Required:
 * - GMAIL_USER: Your Gmail address (e.g., yourname@gmail.com)
 * - GMAIL_APP_PASSWORD: Your Gmail App Password (16 characters, no spaces)
 * 
 * Optional:
 * - GMAIL_FROM_NAME: Display name for the sender (default: uses email address)
 */

const nodemailer = require('nodemailer')

/**
 * Create a Gmail SMTP transporter
 * @returns {Promise<nodemailer.Transporter>} Configured nodemailer transporter
 * @throws {Error} If required environment variables are missing
 */
async function createGmailTransport() {
  const user = process.env.GMAIL_USER
  const password = process.env.GMAIL_APP_PASSWORD

  if (!user || !password) {
    throw new Error(
      'Gmail SMTP credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in environment variables.\n' +
      'Note: You must use a Gmail App Password, not your regular password.\n' +
      'Generate one at: https://myaccount.google.com/apppasswords'
    )
  }

  // Create transporter with Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: user,
      pass: password,
    },
    // Connection timeout
    connectionTimeout: 10000,
    // Greeting timeout
    greetingTimeout: 10000,
    // Socket timeout
    socketTimeout: 10000,
  })

  // Verify connection configuration
  try {
    await transporter.verify()
    console.log('Gmail SMTP transport ready')
    return transporter
  } catch (error) {
    console.error('Gmail SMTP verification failed:', error.message)
    throw new Error(
      `Failed to connect to Gmail SMTP: ${error.message}\n` +
      'Please check your GMAIL_USER and GMAIL_APP_PASSWORD credentials.'
    )
  }
}

/**
 * Send an email via Gmail SMTP
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @param {string} [options.from] - Sender email (defaults to GMAIL_USER)
 * @param {string} [options.fromName] - Sender display name
 * @param {string} [options.replyTo] - Reply-to email address
 * @param {Array} [options.cc] - CC recipients
 * @param {Array} [options.bcc] - BCC recipients
 * @param {Array} [options.attachments] - Email attachments
 * @returns {Promise<Object>} Send result with messageId
 */
async function sendEmail(options) {
  if (!options || !options.to || !options.subject) {
    throw new Error('Missing required email fields: to and subject are required')
  }

  if (!options.text && !options.html) {
    throw new Error('Email must have either text or html body')
  }

  const transporter = await createGmailTransport()

  // Prepare sender address
  const fromEmail = options.from || process.env.GMAIL_USER
  const fromName = options.fromName || process.env.GMAIL_FROM_NAME
  const from = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail

  // Prepare email options
  const mailOptions = {
    from: from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
    cc: options.cc,
    bcc: options.bcc,
    attachments: options.attachments,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    })
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    }
  } catch (error) {
    console.error('Failed to send email:', error.message)
    throw new Error(`Email send failed: ${error.message}`)
  }
}

/**
 * Send a simple text email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email text content
 * @returns {Promise<Object>} Send result
 */
async function sendTextEmail(to, subject, text) {
  return sendEmail({ to, subject, text })
}

/**
 * Send an HTML email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @returns {Promise<Object>} Send result
 */
async function sendHtmlEmail(to, subject, html) {
  return sendEmail({ to, subject, html })
}

module.exports = {
  createGmailTransport,
  sendEmail,
  sendTextEmail,
  sendHtmlEmail,
}

