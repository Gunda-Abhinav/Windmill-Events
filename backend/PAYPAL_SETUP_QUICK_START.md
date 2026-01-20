# PayPal Integration - Quick Start

## ✅ What Was Implemented

### Backend Changes
1. **Database Migration** - Added payment tracking columns to `event_registrations` table
2. **PayPal Service** - Created `lib/paypal-service.js` for PayPal API integration
3. **API Endpoints**:
   - `POST /api/event-registrations` - Creates registration + PayPal order
   - `POST /api/paypal/capture` - Captures payment after user approval
   - `GET /api/event-registrations/:id` - Get registration with payment status
   - `GET /api/paypal/order/:orderId` - Get PayPal order details

### Frontend Changes
1. **Registration Flow** - Updated to redirect to PayPal after registration
2. **Payment Success Page** - `/payment/success` - Captures payment and shows confirmation
3. **Payment Cancelled Page** - `/payment/cancelled` - Handles cancelled payments

### Payment Statuses
- `pending` - Registration created, awaiting payment
- `processing` - Redirected to PayPal
- `completed` - Payment successful ✅
- `failed` - Payment failed ❌
- `cancelled` - User cancelled payment
- `refunded` - Payment refunded

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get PayPal Sandbox Credentials

1. Go to https://developer.paypal.com/dashboard/
2. Log in (create account if needed)
3. Click "Apps & Credentials"
4. Under "Sandbox" tab, click "Create App"
5. Name it "Windmill Events Dev"
6. Copy the **Client ID** and **Secret**

### Step 2: Update .env

Add to `backend/.env`:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=paste-your-client-id-here
PAYPAL_CLIENT_SECRET=paste-your-secret-here
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:3000
```

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

### Step 4: Test It!

1. Go to http://localhost:3000/events
2. Click on "Hearts and Beats" event
3. Click "Register Now"
4. Fill out the form
5. Click "Register"
6. You'll be redirected to PayPal sandbox
7. Log in with PayPal sandbox test account
8. Complete payment
9. You'll be redirected back to success page

## 🧪 PayPal Sandbox Test Accounts

PayPal automatically creates test accounts for you:

1. Go to https://developer.paypal.com/dashboard/accounts
2. You'll see "Personal" and "Business" test accounts
3. Click on a Personal account
4. Click "View/Edit Account"
5. Use the email and password to log in during testing

**Or create a new test account:**
1. Click "Create Account"
2. Select "Personal" (Buyer Account)
3. Fill in details
4. Use this account to make test payments

## 📊 Check Payment Status

### In Database:

```bash
cd backend
node -e "require('dotenv').config(); const {Pool}=require('pg'); const p=new Pool({connectionString:process.env.DATABASE_URL}); p.query('SELECT id, full_name, event_title, total_amount, payment_status, payment_method, payment_date FROM event_registrations ORDER BY created_at DESC LIMIT 5').then(r=>{console.table(r.rows)}).finally(()=>p.end())"
```

### Via API:

```bash
# Get registration by ID
curl http://localhost:4000/api/event-registrations/YOUR-REGISTRATION-ID
```

## 🎯 Complete Flow Example

```
1. User visits: http://localhost:3000/events/hearts-and-beats
2. Clicks "Register Now"
3. Fills form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Passes: 2
   - Accepts terms
4. Clicks "Register"
5. Backend creates:
   - Registration (status: pending)
   - PayPal order (status: processing)
6. User redirected to PayPal
7. User logs in with sandbox account
8. User approves payment
9. PayPal redirects to: /payment/success?token=ORDER_ID
10. Frontend calls: POST /api/paypal/capture
11. Backend captures payment
12. Database updated (status: completed)
13. User sees success message
```

## 🔍 Troubleshooting

### "PayPal credentials not configured"
- Check `.env` has `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
- Restart backend after adding credentials

### Can't log in to PayPal sandbox
- Use test account from https://developer.paypal.com/dashboard/accounts
- Don't use your real PayPal account in sandbox

### Payment not captured
- Check browser console for errors
- Check backend logs
- Verify order ID is correct

### Redirect URLs not working
- Make sure `FRONTEND_URL=http://localhost:3000` in `.env`
- Check frontend is running on port 3000

## 📁 Files Created/Modified

### Backend:
- `migrations/0005_add_payment_tracking.sql` - Database migration
- `lib/paypal-service.js` - PayPal integration
- `server.js` - Updated API endpoints
- `.env.example` - Added PayPal config
- `PAYPAL_INTEGRATION_GUIDE.md` - Full documentation

### Frontend:
- `app/events/[slug]/register/page.tsx` - Updated to redirect to PayPal
- `app/payment/success/page.tsx` - Payment success page
- `app/payment/cancelled/page.tsx` - Payment cancelled page

## 🌐 Going Live

When ready for production:

1. Get live PayPal credentials from https://developer.paypal.com/
2. Update `.env`:
   ```bash
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=live-client-id
   PAYPAL_CLIENT_SECRET=live-secret
   FRONTEND_URL=https://yourdomain.com
   ```
3. Test with small amounts first
4. Monitor PayPal dashboard

## 📚 Documentation

- Full Guide: `PAYPAL_INTEGRATION_GUIDE.md`
- PayPal Docs: https://developer.paypal.com/docs/
- PayPal Dashboard: https://developer.paypal.com/dashboard/

## ✨ Summary

**Payment integration is complete and ready to test!**

Just add your PayPal sandbox credentials to `.env` and restart the backend. The entire flow from registration to payment is automated.

