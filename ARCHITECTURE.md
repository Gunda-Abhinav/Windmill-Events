# Windmill Events - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              GCP HTTPS Load Balancer                         │
│              (your-domain.com)                               │
│                                                              │
│  Routing Rules:                                              │
│  • /api/*  → Backend Service                                 │
│  • /*      → Frontend Service                                │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  Cloud Run Service       │  │  Cloud Run Service       │
│  windmill-frontend       │  │  windmill-backend        │
│                          │  │                          │
│  • Next.js 14            │  │  • Express.js            │
│  • React UI              │  │  • REST API              │
│  • Server-side rendering │  │  • PayPal integration    │
│  • Port 8080             │  │  • Email service         │
│                          │  │  • Port 8080             │
└──────────────────────────┘  └──────────┬───────────────┘
                                         │
                                         ▼
                              ┌──────────────────────────┐
                              │  PostgreSQL Database     │
                              │  (Cloud SQL or external) │
                              │                          │
                              │  • Events                │
                              │  • Registrations         │
                              │  • Payments              │
                              │  • Email queue           │
                              └──────────────────────────┘
```

## Components

### Frontend (Next.js)
- **Technology**: Next.js 14 with App Router
- **Deployment**: Cloud Run (windmill-frontend)
- **Responsibilities**:
  - Serve web pages and UI
  - Client-side routing
  - Form handling
  - PayPal checkout integration
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Backend API URL (via load balancer)
  - `PORT`: 8080 (set by Cloud Run)

### Backend (Express.js)
- **Technology**: Node.js with Express
- **Deployment**: Cloud Run (windmill-backend)
- **Responsibilities**:
  - REST API endpoints
  - Database operations
  - PayPal payment processing
  - Email queue management
  - Business logic
- **Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE`
  - `GMAIL_USER`, `GMAIL_APP_PASSWORD`
  - `FRONTEND_URL`: Frontend URL for CORS and redirects
  - `PORT`: 8080 (set by Cloud Run)

### Database (PostgreSQL)
- **Technology**: PostgreSQL 14+
- **Deployment**: Cloud SQL or external provider
- **Tables**:
  - `events`: Event information with pricing
  - `event_banners`: Binary image storage
  - `event_registrations`: User registrations
  - `email_queue`: Outgoing emails
  - `migrations`: Schema version tracking

### Load Balancer (GCP HTTPS LB)
- **Purpose**: Single entry point for all traffic
- **Features**:
  - SSL/TLS termination
  - Path-based routing
  - Global CDN (optional)
  - DDoS protection
- **Routing**:
  - `/api/*` → Backend Cloud Run service
  - All other paths → Frontend Cloud Run service

## Data Flow

### Event Registration Flow
1. User visits `https://your-domain.com/events`
2. Load balancer routes to **Frontend**
3. Frontend fetches events from `https://your-domain.com/api/events`
4. Load balancer routes `/api/events` to **Backend**
5. Backend queries **Database** and returns events with pricing
6. User fills registration form and clicks "Pay with PayPal"
7. Frontend sends registration to `https://your-domain.com/api/event-registrations`
8. Backend:
   - Validates data
   - Creates PayPal order
   - Saves registration to database
   - Returns PayPal order ID
9. User completes payment on PayPal
10. PayPal redirects to frontend success page
11. Frontend calls `https://your-domain.com/api/paypal/capture`
12. Backend:
    - Captures payment
    - Updates registration status
    - Queues confirmation email
13. Email worker sends confirmation email

## Security

### Authentication & Authorization
- Public endpoints: Events listing, event details
- No authentication required (public event registration)
- PayPal handles payment security

### CORS Configuration
- Backend allows requests from `FRONTEND_URL`
- Load balancer handles SSL/TLS

### Environment Variables
- Sensitive data stored in Cloud Run environment variables
- Use GCP Secret Manager for production secrets

### Database Security
- Connection via SSL
- Cloud SQL: Private IP or Cloud SQL Proxy
- Connection pooling to prevent exhaustion

## Scalability

### Auto-scaling
- Both Cloud Run services scale automatically based on requests
- Min instances: 0 (scale to zero when idle)
- Max instances: 10 (configurable)

### Database
- Connection pooling (max 20 connections per backend instance)
- Read replicas can be added if needed

### CDN (Optional)
- Enable Cloud CDN on load balancer for static assets
- Reduces backend load and improves performance

## Monitoring & Logging

### Cloud Run Logs
- Frontend logs: `gcloud run services logs read windmill-frontend`
- Backend logs: `gcloud run services logs read windmill-backend`

### Metrics
- Request count, latency, error rate
- Available in GCP Console → Cloud Run

### Alerts
- Set up budget alerts
- Monitor error rates
- Database connection pool exhaustion

## Deployment Process

1. **Deploy Backend**:
   ```bash
   ./deploy-backend.sh
   ```

2. **Deploy Frontend**:
   ```bash
   ./deploy-frontend.sh
   ```

3. **Configure Load Balancer**:
   - Create backend services for both Cloud Run services
   - Set up path-based routing
   - Configure SSL certificate
   - Point DNS to load balancer IP

4. **Set Environment Variables**:
   - Backend: Database, PayPal, Gmail credentials
   - Frontend: API URL

5. **Run Database Migrations**:
   ```bash
   node backend/run_migrations.js
   ```

## Cost Breakdown

### Monthly Costs (Estimated)
- **Cloud Run Frontend**: $0-10 (scales to zero)
- **Cloud Run Backend**: $5-15 (minimal traffic)
- **Load Balancer**: $18-25 (fixed cost)
- **Cloud SQL**: $7-35 (depends on tier)
- **Total**: ~$30-85/month for low-medium traffic

### Cost Optimization
- Scale to zero when idle
- Use smallest Cloud SQL tier that meets needs
- Enable Cloud CDN to reduce backend requests
- Monitor and set budget alerts

