#!/bin/bash

# Frontend Deployment Script for GCP Cloud Run
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Windmill Events - Frontend Deployment${NC}"
echo "=========================================="

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="windmill-frontend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Check required tools
command -v gcloud >/dev/null 2>&1 || { echo -e "${RED}❌ gcloud CLI not installed${NC}"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ docker not installed${NC}"; exit 1; }

echo -e "\n${YELLOW}📋 Configuration:${NC}"
echo "  Project: ${PROJECT_ID}"
echo "  Region: ${REGION}"
echo "  Service: ${SERVICE_NAME}"
echo "  Image: ${IMAGE_NAME}"
echo ""

read -p "Continue? (y/N) " -n 1 -r
echo
[[ ! $REPLY =~ ^[Yy]$ ]] && { echo "Cancelled"; exit 0; }

# Set project
echo -e "\n${BLUE}📦 Setting GCP project...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable APIs
echo -e "\n${BLUE}📦 Enabling APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com

# Build Docker image
echo -e "\n${BLUE}🔨 Building frontend image...${NC}"
cd frontend
docker build -t ${IMAGE_NAME}:latest .
cd ..

# Push to GCR
echo -e "\n${BLUE}📤 Pushing to GCR...${NC}"
docker push ${IMAGE_NAME}:latest

# Deploy to Cloud Run
echo -e "\n${BLUE}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60 \
  --set-env-vars "NODE_ENV=production"

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format 'value(status.url)')

echo -e "\n${GREEN}✅ Frontend deployed!${NC}"
echo -e "${BLUE}${SERVICE_URL}${NC}"
echo ""
echo -e "${YELLOW}⚠️  Set API URL environment variable:${NC}"
echo "gcloud run services update ${SERVICE_NAME} --region ${REGION} \\"
echo "  --update-env-vars NEXT_PUBLIC_API_URL=https://your-backend-url"
echo ""
echo -e "${YELLOW}📝 Next: Configure load balancer to route traffic${NC}"
echo ""

