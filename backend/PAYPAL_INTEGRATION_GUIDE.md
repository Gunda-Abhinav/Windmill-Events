# PayPal Integration Guide

## Overview

Event registrations now include PayPal payment integration. When a user registers for an event, they are redirected to PayPal to complete the payment.

## Payment Flow

```
1. User fills registration form
   ↓
2. Backend creates registration (status: pending)
   ↓
3. Backend creates PayPal order
   ↓
4. User redirected to PayPal (status: processing)
   ↓
5. User completes payment on PayPal
   ↓
6. PayPal redirects back to success page
   ↓
7. Backend captures payment (status: completed)
   ↓
8. User sees confirmation
```

## Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Registration created, awaiting payment initiation |
| `processing` | PayPal order created, user redirected to PayPal |
| `completed` | Payment successful, registration confirmed |
| `failed` | Payment failed or declined |
| `cancelled` | User cancelled payment |
| `refunded` | Payment was refunded |

## Setup Instructions

### 1. Get PayPal Credentials

#### For Development (Sandbox):
1. Go to https://developer.paypal.com/dashboard/
2. Log in with your PayPal account
3. Go to "Apps & Credentials"
4. Under "Sandbox", click "Create App"
5. Copy the **Client ID** and **Secret**

#### For Production (Live):
1. Same steps as above
2. Switch to "Live" tab instead of "Sandbox"
3. Complete business verification
4. Copy live credentials

### 2. Configure Environment Variables

Add to `backend/.env`:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-secret
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:3000
```

For production:
```bash
PAYPAL_MODE=live
FRONTEND_URL=https://yourdomain.com
```

### 3. Test the Integration

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev` (in frontend directory)
3. Go to http://localhost:3000/events
4. Select an event and click "Register"
5. Fill out the form
6. You'll be redirected to PayPal sandbox
7. Use PayPal sandbox test account to complete payment
8. You'll be redirected back to success page

#### PayPal Sandbox Test Accounts

PayPal provides test accounts for sandbox testing:
- Go to https://developer.paypal.com/dashboard/accounts
- Use the "Personal" account to make test payments
- Default password is usually displayed or can be reset

## API Endpoints

### POST /api/event-registrations
Creates a registration and PayPal order

**Request:**
```json
{
  "eventTitle": "Hearts and Beats",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "passes": 2,
  "acceptedLiability": true
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Success",
  "id": "uuid",
  "totalAmount": "120.00",
  "paypalOrderId": "paypal-order-id",
  "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=..."
}
```

### POST /api/paypal/capture
Captures payment after user approves on PayPal

**Request:**
```json
{
  "orderId": "paypal-order-id"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Payment completed successfully",
  "registration": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "event_title": "Hearts and Beats",
    "passes": 2,
    "total_amount": "120.00"
  },
  "payment": {
    "orderId": "paypal-order-id",
    "captureId": "capture-id",
    "status": "COMPLETED"
  }
}
```

### GET /api/event-registrations/:id
Get registration details including payment status

**Response:**
```json
{
  "ok": true,
  "registration": {
    "id": "uuid",
    "event_title": "Hearts and Beats",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "passes": 2,
    "price_per_pass": "60.00",
    "total_amount": "120.00",
    "payment_status": "completed",
    "payment_method": "paypal",
    "payment_id": "capture-id",
    "paypal_order_id": "order-id",
    "payment_date": "2026-01-19T23:45:00.000Z",
    "created_at": "2026-01-19T23:43:00.000Z"
  }
}
```

## Database Schema

The `event_registrations` table includes these payment-related columns:

```sql
payment_status text NOT NULL DEFAULT 'pending'
payment_method text
payment_id text
paypal_order_id text
payment_date timestamptz
payment_details jsonb
updated_at timestamptz
```

## Frontend Pages

- `/events/[slug]/register` - Registration form
- `/payment/success` - Payment success page (captures payment)
- `/payment/cancelled` - Payment cancelled page

## Troubleshooting

### "PayPal credentials not configured" error
- Make sure `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set in `.env`
- Restart the backend after adding credentials

### Payment capture fails
- Check that the order ID is correct
- Verify the order hasn't already been captured
- Check PayPal dashboard for order status

### Redirect URLs not working
- Make sure `FRONTEND_URL` is set correctly in `.env`
- For local development: `http://localhost:3000`
- For production: `https://yourdomain.com`

## Security Notes

1. **Never commit credentials** - Keep `.env` in `.gitignore`
2. **Use sandbox for testing** - Don't use live credentials in development
3. **Validate on server** - All payment validation happens on backend
4. **Store payment details** - Full PayPal response stored in `payment_details` for auditing

## Going Live

1. Get live PayPal credentials
2. Update `.env`:
   ```bash
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=live-client-id
   PAYPAL_CLIENT_SECRET=live-secret
   FRONTEND_URL=https://yourdomain.com
   ```
3. Test thoroughly with small amounts
4. Monitor PayPal dashboard for transactions

## Support

- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal Sandbox: https://developer.paypal.com/dashboard/
- PayPal Support: https://www.paypal.com/us/smarthelp/contact-us

