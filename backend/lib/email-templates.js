/**
 * Email Template System using Nunjucks (Jinja2-like for Node.js)
 * 
 * This module provides a simple way to render HTML email templates
 * using Nunjucks templating engine (similar to Jinja2).
 */

const nunjucks = require('nunjucks')
const path = require('path')

// Configure Nunjucks
const templatesDir = path.join(__dirname, '../templates/emails')
const env = nunjucks.configure(templatesDir, {
  autoescape: true, // Auto-escape HTML for security
  trimBlocks: true,
  lstripBlocks: true,
})

// Add custom filters if needed
env.addFilter('formatDate', function(dateString) {
  if (!dateString) return 'Not specified'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch (e) {
    return dateString
  }
})

env.addFilter('formatPhone', function(phone) {
  if (!phone) return 'Not provided'
  // Format 1234567890 as (123) 456-7890
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
})

/**
 * Render an email template
 * @param {string} templateName - Name of the template file (without .html extension)
 * @param {Object} context - Data to pass to the template
 * @returns {string} Rendered HTML
 */
function renderTemplate(templateName, context = {}) {
  try {
    const html = env.render(`${templateName}.html`, context)
    return html
  } catch (error) {
    console.error(`Failed to render template ${templateName}:`, error.message)
    throw new Error(`Template rendering failed: ${error.message}`)
  }
}

/**
 * Render enquiry notification email
 * @param {Object} enquiry - Enquiry data
 * @returns {string} Rendered HTML
 */
function renderEnquiryEmail(enquiry) {
  return renderTemplate('enquiry-notification', {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    eventType: enquiry.eventType,
    eventDate: enquiry.eventDate,
    message: enquiry.message,
    year: new Date().getFullYear(),
  })
}

/**
 * Render event registration confirmation email
 * @param {Object} registration - Registration data
 * @returns {string} Rendered HTML
 */
function renderEventRegistrationEmail(registration) {
  return renderTemplate('event-registration', {
    fullName: registration.fullName,
    eventTitle: registration.eventTitle,
    eventDate: registration.eventDate,
    venue: registration.venue,
    passes: registration.passes,
    pricePerPass: registration.pricePerPass,
    totalAmount: registration.totalAmount,
    year: new Date().getFullYear(),
  })
}

/**
 * Render a simple notification email
 * @param {Object} data - Email data
 * @returns {string} Rendered HTML
 */
function renderSimpleEmail(data) {
  return renderTemplate('simple-notification', {
    title: data.title || 'Notification',
    message: data.message,
    year: new Date().getFullYear(),
  })
}

/**
 * Render payment confirmation email
 * @param {Object} payment - Payment and registration data
 * @returns {string} Rendered HTML
 */
function renderPaymentConfirmationEmail(payment) {
  return renderTemplate('payment-confirmation', {
    registrationId: payment.registrationId,
    eventTitle: payment.eventTitle,
    eventDate: payment.eventDate,
    venue: payment.venue,
    fullName: payment.fullName,
    passes: payment.passes,
    totalAmount: payment.totalAmount,
    paymentId: payment.paymentId,
    transactionId: payment.transactionId,
    paymentDate: payment.paymentDate || new Date().toISOString(),
    year: new Date().getFullYear(),
  })
}

module.exports = {
  renderTemplate,
  renderEnquiryEmail,
  renderEventRegistrationEmail,
  renderSimpleEmail,
  renderPaymentConfirmationEmail,
}

