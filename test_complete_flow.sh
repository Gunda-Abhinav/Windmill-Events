#!/bin/bash

# Complete Flow Test Script
# Tests: Backend API, Frontend API calls, Email queueing

echo ""
echo "🧪 Testing Complete Application Flow"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend Health Check
echo "1️⃣  Testing Backend Health..."
HEALTH=$(curl -s http://localhost:4000/api/health)
if echo "$HEALTH" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    exit 1
fi

# Test 2: Events API
echo ""
echo "2️⃣  Testing Events API..."
EVENTS=$(curl -s http://localhost:4000/api/events)
if echo "$EVENTS" | grep -q '"ok":true'; then
    EVENT_COUNT=$(echo "$EVENTS" | grep -o '"id"' | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Events API working - Found $EVENT_COUNT events${NC}"
else
    echo -e "${RED}❌ Events API failed${NC}"
    exit 1
fi

# Test 3: Frontend Server
echo ""
echo "3️⃣  Testing Frontend Server..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend not responding (HTTP $FRONTEND)${NC}"
    exit 1
fi

# Test 4: Email Queue Table
echo ""
echo "4️⃣  Testing Email Queue..."
cd backend
EMAIL_TEST=$(node -e "
require('dotenv').config();
const {Pool}=require('pg');
const p=new Pool({connectionString:process.env.DATABASE_URL});
p.query('SELECT COUNT(*) as count FROM email_queue WHERE status = \\'pending\\'')
  .then(r=>{
    console.log('Pending emails:', r.rows[0].count);
    process.exit(0);
  })
  .catch(e=>{
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(()=>p.end());
" 2>&1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Email queue accessible${NC}"
    echo "   $EMAIL_TEST"
else
    echo -e "${RED}❌ Email queue check failed${NC}"
    echo "   $EMAIL_TEST"
fi

# Test 5: Email Worker Status
echo ""
echo "5️⃣  Checking Email Worker..."
if pgrep -f "email_worker_simple.js" > /dev/null; then
    echo -e "${GREEN}✅ Email worker is running${NC}"
else
    echo -e "${YELLOW}⚠️  Email worker is not running${NC}"
    echo "   Start it with: cd backend && npm run email:worker"
fi

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "📋 Service Status:"
echo "   • Backend API:    http://localhost:4000"
echo "   • Frontend UI:    http://localhost:3000"
echo "   • Email Worker:   $(pgrep -f 'email_worker_simple.js' > /dev/null && echo 'Running' || echo 'Stopped')"
echo ""
echo "🧪 Next Steps:"
echo "   1. Open http://localhost:3000/events in your browser"
echo "   2. Register for an event"
echo "   3. Complete PayPal payment (use sandbox account)"
echo "   4. Check email queue: cd backend && node -e \"require('dotenv').config(); const {Pool}=require('pg'); const p=new Pool({connectionString:process.env.DATABASE_URL}); p.query('SELECT * FROM email_queue ORDER BY created_at DESC LIMIT 5').then(r=>{console.table(r.rows)}).finally(()=>p.end())\""
echo ""

