/**
 * PayPal Service Module
 *
 * Handles PayPal payment integration for event registrations
 * Uses PayPal REST API v2 for order creation and capture
 */

const { Client, Environment, LogLevel, OrdersController, PaymentsController } = require('@paypal/paypal-server-sdk')

/**
 * Initialize PayPal client
 * Uses sandbox for development, live for production
 */
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const environment = process.env.PAYPAL_MODE || 'sandbox' // 'sandbox' or 'live'

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env')
  }

  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    environment: environment === 'live' ? Environment.Production : Environment.Sandbox,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: { logBody: true },
      logResponse: { logHeaders: true },
    },
  })

  return client
}

/**
 * Create a PayPal order for event registration
 * 
 * @param {Object} params - Order parameters
 * @param {string} params.registrationId - Event registration ID
 * @param {number} params.amount - Total amount in USD
 * @param {string} params.eventTitle - Event title
 * @param {string} params.customerEmail - Customer email
 * @param {number} params.passes - Number of passes
 * @returns {Promise<Object>} PayPal order response with order ID
 */
async function createOrder({ registrationId, amount, eventTitle, customerEmail, passes }) {
  try {
    const client = getPayPalClient()
    const ordersController = new OrdersController(client)

    const request = {
      body: {
        intent: 'CAPTURE',
        purchaseUnits: [
          {
            referenceId: registrationId,
            description: `${eventTitle} - ${passes} pass${passes > 1 ? 'es' : ''}`,
            customId: registrationId,
            amount: {
              currencyCode: 'USD',
              value: amount.toFixed(2),
            },
          },
        ],
        applicationContext: {
          brandName: 'Windmill Events',
          landingPage: 'BILLING',
          userAction: 'PAY_NOW',
          returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
          cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancelled`,
        },
        payer: {
          emailAddress: customerEmail,
        },
      },
    }

    const response = await ordersController.createOrder(request)

    return {
      success: true,
      orderId: response.result.id,
      status: response.result.status,
      links: response.result.links,
      details: response.result,
    }
  } catch (error) {
    console.error('PayPal createOrder error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create PayPal order',
      details: error,
    }
  }
}

/**
 * Capture payment for a PayPal order
 * 
 * @param {string} orderId - PayPal order ID
 * @returns {Promise<Object>} Capture response with payment details
 */
async function captureOrder(orderId) {
  try {
    const client = getPayPalClient()
    const ordersController = new OrdersController(client)

    const request = {
      id: orderId,
    }

    const response = await ordersController.captureOrder(request)
    
    const captureId = response.result.purchaseUnits[0]?.payments?.captures[0]?.id
    const status = response.result.status
    const payerEmail = response.result.payer?.emailAddress
    const amount = response.result.purchaseUnits[0]?.payments?.captures[0]?.amount

    return {
      success: true,
      orderId: response.result.id,
      captureId,
      status,
      payerEmail,
      amount,
      details: response.result,
    }
  } catch (error) {
    console.error('PayPal captureOrder error:', error)
    return {
      success: false,
      error: error.message || 'Failed to capture PayPal payment',
      details: error,
    }
  }
}

/**
 * Get order details
 * 
 * @param {string} orderId - PayPal order ID
 * @returns {Promise<Object>} Order details
 */
async function getOrderDetails(orderId) {
  try {
    const client = getPayPalClient()
    const ordersController = new OrdersController(client)

    const response = await ordersController.getOrder({ id: orderId })
    
    return {
      success: true,
      details: response.result,
    }
  } catch (error) {
    console.error('PayPal getOrderDetails error:', error)
    return {
      success: false,
      error: error.message || 'Failed to get order details',
    }
  }
}

module.exports = {
  createOrder,
  captureOrder,
  getOrderDetails,
}

