/**
 * Simplified Email Service
 * 
 * This module combines Gmail SMTP and Nunjucks templates
 * to provide a simple, unified email sending interface.
 */

const { sendEmail } = require('./gmail-smtp')
const { renderEnquiryEmail, renderEventRegistrationEmail, renderSimpleEmail } = require('./email-templates')

/**
 * Send enquiry notification email to admin
 * @param {Object} enquiry - Enquiry data
 * @returns {Promise<Object>} Send result
 */
async function sendEnquiryNotification(enquiry) {
  try {
    // Render HTML from template
    const html = renderEnquiryEmail(enquiry)
    
    // Send email
    const result = await sendEmail({
      to: process.env.ADMIN_TO || process.env.GMAIL_USER,
      subject: `New Enquiry from ${enquiry.name}`,
      html: html,
      replyTo: enquiry.email,
    })
    
    console.log(`✅ Enquiry notification sent to ${process.env.ADMIN_TO || process.env.GMAIL_USER}`)
    return result
  } catch (error) {
    console.error('Failed to send enquiry notification:', error.message)
    throw error
  }
}

/**
 * Send event registration confirmation email
 * @param {Object} registration - Registration data
 * @returns {Promise<Object>} Send result
 */
async function sendEventRegistrationConfirmation(registration) {
  try {
    // Render HTML from template
    const html = renderEventRegistrationEmail(registration)
    
    // Send email
    const result = await sendEmail({
      to: registration.email,
      subject: `Registration Confirmed - ${registration.eventTitle}`,
      html: html,
    })
    
    console.log(`✅ Registration confirmation sent to ${registration.email}`)
    return result
  } catch (error) {
    console.error('Failed to send registration confirmation:', error.message)
    throw error
  }
}

/**
 * Send a simple notification email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Message content
 * @returns {Promise<Object>} Send result
 */
async function sendSimpleNotification(to, subject, message) {
  try {
    // Render HTML from template
    const html = renderSimpleEmail({ title: subject, message })
    
    // Send email
    const result = await sendEmail({
      to: to,
      subject: subject,
      html: html,
    })
    
    console.log(`✅ Simple notification sent to ${to}`)
    return result
  } catch (error) {
    console.error('Failed to send simple notification:', error.message)
    throw error
  }
}

module.exports = {
  sendEnquiryNotification,
  sendEventRegistrationConfirmation,
  sendSimpleNotification,
}

