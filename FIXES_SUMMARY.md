# Fixes Summary - Email & API Configuration

## Issues Fixed

### 1. ✅ Email Not Sent After Payment
**Problem**: Users were not receiving confirmation emails after completing payment.

**Root Cause**: The payment capture endpoint was trying to insert into a column called `html_body` but the actual database column is named `body`. Also missing the required `sender` column.

**Fix**: Updated `backend/server.js` line 587-596:
```javascript
// BEFORE (incorrect)
await pool.query(
  `INSERT INTO email_queue (recipient, subject, html_body, created_at)
   VALUES ($1, $2, $3, now())`,
  [regData.email, `Payment Confirmation - ${regData.event_title}`, emailHtml]
)

// AFTER (correct)
await pool.query(
  `INSERT INTO email_queue (recipient, sender, subject, body, status, created_at)
   VALUES ($1, $2, $3, $4, 'pending', now())`,
  [
    regData.email,
    process.env.GMAIL_USER || 'contact@windmill-events.com',
    `Payment Confirmation - ${regData.event_title}`,
    emailHtml,
  ]
)
```

**Files Modified**:
- `backend/server.js` (payment capture endpoint)

---

### 2. ✅ Frontend API Calls Going to Wrong URL
**Problem**: Frontend was calling `http://localhost:3000/api/events` instead of `http://localhost:4000/api/events`.

**Root Cause**: Inconsistent environment variable names across the codebase:
- Some files used `NEXT_PUBLIC_API_URL`
- Some files used `NEXT_PUBLIC_API_BASE_URL`
- Environment file only had `NEXT_PUBLIC_API_BASE_URL`

**Fix**: Standardized on `NEXT_PUBLIC_API_URL` everywhere.

**Files Modified**:
- `frontend/.env` - Updated to use `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
- `frontend/app/events/[slug]/register/page.tsx` - Changed to use `NEXT_PUBLIC_API_URL`
- `frontend/app/payment/success/page.tsx` - Changed to use `NEXT_PUBLIC_API_URL`
- `frontend/components/contact/contact-form.tsx` - Changed to use `NEXT_PUBLIC_API_URL`

**Environment Variable**:
```bash
# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Current Configuration

### Local Development
- **Backend**: `http://localhost:4000`
- **Frontend**: `http://localhost:3000`
- **API Calls**: Frontend → `http://localhost:4000/api/*`

### Environment Variables

**Backend** (`backend/.env`):
```bash
DATABASE_URL=postgresql://...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
GMAIL_USER=contact@windmill-events.com
GMAIL_APP_PASSWORD=...
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Testing the Fixes

### Test 1: Email Queueing
1. Start all services:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Email Worker
   cd backend && npm run email:worker
   
   # Terminal 3: Frontend
   cd frontend && npm run dev
   ```

2. Complete a payment flow:
   - Go to http://localhost:3000/events
   - Register for an event
   - Complete PayPal payment (sandbox)

3. Check email queue:
   ```bash
   cd backend
   node -e "require('dotenv').config(); const {Pool}=require('pg'); const p=new Pool({connectionString:process.env.DATABASE_URL}); p.query('SELECT id, recipient, subject, status, created_at FROM email_queue ORDER BY created_at DESC LIMIT 5').then(r=>{console.table(r.rows)}).finally(()=>p.end())"
   ```

4. Expected: Email should be in queue with `status='pending'` or `status='sent'`

### Test 2: API Calls
1. Open browser DevTools (Network tab)
2. Go to http://localhost:3000/events
3. Check network requests:
   - ✅ Should see: `http://localhost:4000/api/events` (200 OK)
   - ❌ Should NOT see: `http://localhost:3000/api/events` (404)

### Test 3: Contact Form
1. Go to http://localhost:3000/contact
2. Fill out and submit the contact form
3. Check network requests:
   - ✅ Should see: `http://localhost:4000/api/enquiries` (201 Created)
   - ❌ Should NOT see: `http://localhost:3000/api/enquiries` (404)

---

## Running Services

### Start All Services
```bash
# Terminal 1: Backend API
cd backend
npm run dev
# Runs on http://localhost:4000

# Terminal 2: Email Worker
cd backend
npm run email:worker
# Processes email queue

# Terminal 3: Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Check Service Status
```bash
# Backend health
curl http://localhost:4000/api/health

# Frontend
curl -I http://localhost:3000

# Email worker (check if process is running)
ps aux | grep email_worker_simple.js
```

---

## Next Steps: Docker & Cloud Run

The fixes are now ready for Docker deployment. The deployment configuration uses:

**Frontend Docker** (`NEXT_PUBLIC_API_URL`):
- Local: `http://localhost:4000/api`
- Production: `https://your-domain.com/api` (via load balancer)

**Backend Docker** (no changes needed):
- Exposes port 8080
- Serves API at `/api/*`

**Load Balancer Routing**:
- `/api/*` → Backend Cloud Run service
- `/*` → Frontend Cloud Run service

This ensures the frontend always calls the correct backend URL in all environments.

