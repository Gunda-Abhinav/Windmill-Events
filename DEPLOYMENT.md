# Windmill Events - Deployment Guide

This guide covers building and deploying the Windmill Events application.

## Architecture

The application uses a **microservices deployment model** with separate frontend and backend services:
- **Frontend**: Next.js application deployed on Cloud Run
- **Backend**: Express.js API server deployed on Cloud Run
- **Load Balancer**: GCP Load Balancer routes traffic:
  - `/api/*` → Backend service
  - All other routes → Frontend service

## Local Development

### Running Separately (Development)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Terminal 3 - Email Worker
cd backend
npm run email:worker
```

Frontend: http://localhost:3000  
Backend API: http://localhost:4000

### Running Together (Production-like)
```bash
# Build everything
./build.sh

# Run in production mode
cd backend
NODE_ENV=production PORT=8080 node server.js
```

Application: http://localhost:8080 (serves both frontend and API)

## Building for Production

### Using the Build Script
```bash
./build.sh
```

This script:
1. Cleans previous builds
2. Installs frontend dependencies
3. Builds frontend static export
4. Installs backend dependencies
5. Runs database migrations
6. Outputs build summary

### Manual Build
```bash
# Build frontend
cd frontend
npm ci
npm run build

# Install backend dependencies
cd ../backend
npm ci --production

# Run migrations
node run_migrations.js
```

## Deployment to GCP Cloud Run

### Prerequisites
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Install [Docker](https://docs.docker.com/get-docker/)
3. Authenticate with GCP:
   ```bash
   gcloud auth login
   gcloud auth configure-docker
   ```

### Environment Variables

Set these before deploying:
```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"  # or your preferred region
```

### Step 1: Deploy Backend

```bash
./deploy-backend.sh
```

The script will:
1. Build the backend Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run as `windmill-backend`
4. Output the backend service URL

After deployment, configure environment variables:
```bash
gcloud run services update windmill-backend \
  --region us-central1 \
  --update-env-vars \
DATABASE_URL="postgresql://user:pass@host:5432/dbname",\
PAYPAL_CLIENT_ID="your-paypal-client-id",\
PAYPAL_CLIENT_SECRET="your-paypal-secret",\
PAYPAL_MODE="live",\
GMAIL_USER="your-email@gmail.com",\
GMAIL_APP_PASSWORD="your-app-password",\
FRONTEND_URL="https://your-domain.com"
```

### Step 2: Deploy Frontend

```bash
./deploy-frontend.sh
```

The script will:
1. Build the frontend Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run as `windmill-frontend`
4. Output the frontend service URL

After deployment, configure the API URL:
```bash
gcloud run services update windmill-frontend \
  --region us-central1 \
  --update-env-vars \
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
```

### Step 3: Set Up Load Balancer

#### Option A: Using GCP Console (Recommended for beginners)

1. **Reserve a Static IP Address**
   - Go to VPC Network → External IP addresses
   - Click "Reserve Static Address"
   - Name: `windmill-events-ip`
   - Type: Global
   - Click "Reserve"

2. **Create Backend Services**

   a. **Backend Service for API**:
   - Go to Network Services → Load Balancing
   - Click "Create Load Balancer"
   - Choose "HTTP(S) Load Balancing"
   - Choose "From Internet to my VMs or serverless services"
   - Click "Continue"
   - Name: `windmill-lb`
   - Backend Configuration:
     - Click "Backend services & backend buckets" → "Create a backend service"
     - Name: `windmill-backend-service`
     - Backend type: "Serverless network endpoint group"
     - Click "Create Serverless NEG":
       - Name: `windmill-backend-neg`
       - Region: `us-central1` (match your Cloud Run region)
       - Serverless NEG type: "Cloud Run"
       - Select service: `windmill-backend`
       - Click "Create"
     - Click "Create"

   b. **Backend Service for Frontend**:
   - Click "Backend services & backend buckets" → "Create a backend service"
   - Name: `windmill-frontend-service`
   - Backend type: "Serverless network endpoint group"
   - Click "Create Serverless NEG":
     - Name: `windmill-frontend-neg`
     - Region: `us-central1`
     - Serverless NEG type: "Cloud Run"
     - Select service: `windmill-frontend`
     - Click "Create"
   - Click "Create"

3. **Configure Host and Path Rules**
   - In the load balancer configuration:
   - Host and path rules:
     - Add path rule for `/api/*`:
       - Paths: `/api/*`
       - Backend: `windmill-backend-service`
     - Default rule (all other paths):
       - Backend: `windmill-frontend-service`

4. **Configure Frontend**
   - Name: `windmill-frontend-config`
   - Protocol: HTTPS
   - IP address: Select the reserved static IP
   - Certificate: Create or select an SSL certificate
     - For production: Use Google-managed certificate with your domain
     - For testing: Create self-signed certificate

5. **Review and Finalize**
   - Review all settings
   - Click "Create"
   - Wait for the load balancer to be created (5-10 minutes)

6. **Configure DNS**
   - Point your domain to the reserved static IP address
   - Add an A record: `your-domain.com` → `<static-ip>`

#### Option B: Using gcloud CLI

```bash
# Set variables
PROJECT_ID="your-project-id"
REGION="us-central1"
DOMAIN="your-domain.com"

# Reserve static IP
gcloud compute addresses create windmill-events-ip \
  --global

# Get the IP address
IP_ADDRESS=$(gcloud compute addresses describe windmill-events-ip \
  --global --format="value(address)")
echo "Reserved IP: $IP_ADDRESS"

# Create serverless NEGs
gcloud compute network-endpoint-groups create windmill-backend-neg \
  --region=${REGION} \
  --network-endpoint-type=serverless \
  --cloud-run-service=windmill-backend

gcloud compute network-endpoint-groups create windmill-frontend-neg \
  --region=${REGION} \
  --network-endpoint-type=serverless \
  --cloud-run-service=windmill-frontend

# Create backend services
gcloud compute backend-services create windmill-backend-service \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED

gcloud compute backend-services create windmill-frontend-service \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED

# Add NEGs to backend services
gcloud compute backend-services add-backend windmill-backend-service \
  --global \
  --network-endpoint-group=windmill-backend-neg \
  --network-endpoint-group-region=${REGION}

gcloud compute backend-services add-backend windmill-frontend-service \
  --global \
  --network-endpoint-group=windmill-frontend-neg \
  --network-endpoint-group-region=${REGION}

# Create URL map with path routing
gcloud compute url-maps create windmill-lb \
  --default-service=windmill-frontend-service

gcloud compute url-maps add-path-matcher windmill-lb \
  --path-matcher-name=windmill-matcher \
  --default-service=windmill-frontend-service \
  --path-rules="/api/*=windmill-backend-service"

# Create SSL certificate (Google-managed)
gcloud compute ssl-certificates create windmill-ssl-cert \
  --domains=${DOMAIN}

# Create HTTPS proxy
gcloud compute target-https-proxies create windmill-https-proxy \
  --url-map=windmill-lb \
  --ssl-certificates=windmill-ssl-cert

# Create forwarding rule
gcloud compute forwarding-rules create windmill-https-rule \
  --global \
  --target-https-proxy=windmill-https-proxy \
  --address=windmill-events-ip \
  --ports=443

# Optional: Create HTTP to HTTPS redirect
gcloud compute url-maps import windmill-lb-redirect \
  --global \
  --source /dev/stdin <<EOF
kind: compute#urlMap
name: windmill-lb-redirect
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
EOF

gcloud compute target-http-proxies create windmill-http-proxy \
  --url-map=windmill-lb-redirect

gcloud compute forwarding-rules create windmill-http-rule \
  --global \
  --target-http-proxy=windmill-http-proxy \
  --address=windmill-events-ip \
  --ports=80
```

#### Verify Load Balancer Setup

```bash
# Get the IP address
IP_ADDRESS=$(gcloud compute addresses describe windmill-events-ip \
  --global --format="value(address)")

# Test backend (API)
curl -k https://${IP_ADDRESS}/api/health

# Test frontend
curl -k https://${IP_ADDRESS}/

# After DNS propagation, test with domain
curl https://your-domain.com/api/health
curl https://your-domain.com/
```

### Database Setup

#### Option 1: Cloud SQL (Recommended)
```bash
# Create Cloud SQL instance
gcloud sql instances create windmill-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create windmill --instance=windmill-db

# Connect Cloud Run to Cloud SQL
gcloud run services update windmill-events \
  --add-cloudsql-instances=PROJECT_ID:REGION:windmill-db
```

#### Option 2: External PostgreSQL
Use any PostgreSQL provider (AWS RDS, Azure Database, etc.) and set the `DATABASE_URL` environment variable.

### Run Migrations

After database setup, run migrations:
```bash
# SSH into a Cloud Run instance or use Cloud Shell
node backend/run_migrations.js
```

## Local Docker Testing

### Build and Test Backend Locally
```bash
cd backend
docker build -t windmill-backend .
docker run -p 4000:8080 \
  -e PORT=8080 \
  -e DATABASE_URL="your-db-url" \
  -e PAYPAL_CLIENT_ID="your-id" \
  -e PAYPAL_CLIENT_SECRET="your-secret" \
  -e PAYPAL_MODE="sandbox" \
  -e GMAIL_USER="your-email" \
  -e GMAIL_APP_PASSWORD="your-password" \
  windmill-backend

# Test
curl http://localhost:4000/api/health
```

### Build and Test Frontend Locally
```bash
cd frontend
docker build -t windmill-frontend .
docker run -p 3000:8080 \
  -e PORT=8080 \
  -e NEXT_PUBLIC_API_URL="http://localhost:4000/api" \
  windmill-frontend

# Test
curl http://localhost:3000/
```

## Monitoring

### View Backend Logs
```bash
gcloud run services logs read windmill-backend --region us-central1 --limit 50
```

### View Frontend Logs
```bash
gcloud run services logs read windmill-frontend --region us-central1 --limit 50
```

### Health Checks
```bash
# Backend health
curl https://your-domain.com/api/health

# Frontend health (should return HTML)
curl https://your-domain.com/

# Check specific endpoints
curl https://your-domain.com/api/events
```

### Monitor Load Balancer
```bash
# View load balancer details
gcloud compute url-maps describe windmill-lb

# View backend service health
gcloud compute backend-services get-health windmill-backend-service --global
gcloud compute backend-services get-health windmill-frontend-service --global
```

## Troubleshooting

### Frontend not loading
- Check Cloud Run logs: `gcloud run services logs read windmill-frontend --region us-central1`
- Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Test direct Cloud Run URL (bypass load balancer)
- Check if Next.js build completed successfully in Docker image

### API errors (404, 500)
- Verify all backend environment variables are set
- Check database connectivity from Cloud Run
- Review backend logs: `gcloud run services logs read windmill-backend --region us-central1`
- Test backend health endpoint: `curl https://your-domain.com/api/health`

### Load Balancer Issues
- **503 errors**: Backend services may not be healthy
  - Check: `gcloud compute backend-services get-health windmill-backend-service --global`
  - Ensure Cloud Run services are running and healthy
- **404 for /api routes**: Path matcher may not be configured correctly
  - Verify URL map: `gcloud compute url-maps describe windmill-lb`
  - Check path rules include `/api/*` → backend service
- **SSL certificate issues**:
  - Check certificate status: `gcloud compute ssl-certificates describe windmill-ssl-cert`
  - Google-managed certificates can take 15-60 minutes to provision
  - Ensure DNS is pointing to the load balancer IP

### Database connection issues
- Ensure Cloud SQL connector is configured (if using Cloud SQL)
- Verify DATABASE_URL format: `postgresql://user:password@host:5432/database`
- Check firewall rules allow Cloud Run to connect
- For Cloud SQL: Use private IP or Cloud SQL Proxy

### CORS Issues
- Ensure `FRONTEND_URL` is set correctly in backend environment variables
- Check CORS configuration in `backend/server.js`
- Verify load balancer is routing requests correctly

## Cost Optimization

Cloud Run pricing is based on:
- Request count
- CPU/Memory usage
- Execution time
- Load balancer forwarding rules and data processed

### Optimize Costs:

1. **Cloud Run Services**
   - Set `--min-instances 0` to scale to zero when idle
   - Use `--memory 512Mi` for both services (sufficient for most workloads)
   - Set `--max-instances 10` to prevent runaway costs
   - Enable request-based autoscaling (default)

2. **Load Balancer**
   - Use a single load balancer for both services
   - Consider Cloud CDN for static assets (reduces backend requests)
   - Monitor data transfer costs

3. **Database**
   - Use Cloud SQL with automatic backups
   - Consider read replicas only if needed
   - Use connection pooling (already implemented in backend)

4. **Monitoring**
   - Set up budget alerts in GCP Console
   - Monitor costs by service in Cloud Billing

### Estimated Monthly Costs (Low Traffic)
- Cloud Run (2 services, minimal traffic): $0-5
- Load Balancer: $18-25
- Cloud SQL (db-f1-micro): $7-10
- **Total**: ~$25-40/month

### Estimated Monthly Costs (Medium Traffic - 10k requests/day)
- Cloud Run: $10-20
- Load Balancer: $25-35
- Cloud SQL (db-g1-small): $25-35
- **Total**: ~$60-90/month

