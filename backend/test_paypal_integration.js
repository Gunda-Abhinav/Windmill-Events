/**
 * Test PayPal Integration
 * Quick test to verify PayPal SDK is working correctly
 */

require('dotenv').config()
const { createOrder } = require('./lib/paypal-service')

async function testPayPalIntegration() {
  console.log('\n🧪 Testing PayPal Integration...\n')
  
  console.log('PayPal Configuration:')
  console.log('- Client ID:', process.env.PAYPAL_CLIENT_ID ? process.env.PAYPAL_CLIENT_ID.substring(0, 20) + '...' : 'NOT SET')
  console.log('- Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? '***' + process.env.PAYPAL_CLIENT_SECRET.substring(process.env.PAYPAL_CLIENT_SECRET.length - 4) : 'NOT SET')
  console.log('- Mode:', process.env.PAYPAL_MODE || 'NOT SET')
  console.log('- Frontend URL:', process.env.FRONTEND_URL || 'NOT SET')
  console.log()

  try {
    console.log('Creating test PayPal order...')
    
    const result = await createOrder({
      registrationId: 'test-123',
      amount: 60.00,
      eventTitle: 'Hearts and Beats',
      customerEmail: 'test@example.com',
      passes: 1,
    })

    if (result.success) {
      console.log('✅ PayPal order created successfully!')
      console.log('- Order ID:', result.orderId)
      console.log('- Status:', result.status)
      console.log('- Approval URL:', result.links?.find(l => l.rel === 'approve')?.href || 'Not found')
      console.log('\n✅ PayPal integration is working correctly!')
    } else {
      console.log('❌ Failed to create PayPal order')
      console.log('Error:', result.error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
  }
}

testPayPalIntegration()

