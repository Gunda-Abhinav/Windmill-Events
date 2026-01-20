#!/bin/sh
# Start Next.js (from frontend) on port 3000 and then start backend server.js on port 4000
set -e

NEXT_PORT=${NEXT_PORT:-3000}
PORT=${PORT:-4000}

echo "Starting Next.js on port ${NEXT_PORT}..."
cd /app/frontend || exit 1

# Use next binary from node_modules
# If you built the frontend in the image the node_modules will exist
node ./node_modules/next/dist/bin/next start -p ${NEXT_PORT} &
NEXT_PID=$!

cd /app/backend || exit 1
echo "Starting backend on port ${PORT}..."
node server.js

# If backend exits, shut down Next
kill $NEXT_PID || true
wait $NEXT_PID || true
