# Stage 1: Build frontend
FROM node:18 AS frontend-builder
WORKDIR /build/frontend

# Copy frontend package files and sources
COPY frontend/package.json frontend/package-lock.json* ./
COPY frontend/ ./

# Install and build
RUN npm ci --silent
RUN npm run build --silent

# Stage 2: Runtime (Next + Backend)
FROM node:18-slim
WORKDIR /app

# Copy backend
COPY backend/package.json backend/package-lock.json* ./backend/
COPY backend/ ./backend/

# Copy frontend .next, node_modules, and other files from builder stage
COPY --from=frontend-builder /build/frontend/.next ./frontend/.next
COPY --from=frontend-builder /build/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-builder /build/frontend/package.json ./frontend/package.json
COPY --from=frontend-builder /build/frontend/public ./frontend/public
COPY --from=frontend-builder /build/frontend/next.config.mjs ./frontend/next.config.mjs

# Make start script executable
RUN chmod +x ./backend/start.sh || true

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --production --silent || true

EXPOSE 4000
CMD ["/bin/sh", "-c", "/app/backend/start.sh"]
