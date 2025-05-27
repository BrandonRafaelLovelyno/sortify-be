# Stage 1: Builder - Install dependencies and build the app
FROM node:24-alpine3.20 AS builder

# Install dependencies needed for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy remaining files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Runner - Production-ready image
FROM node:24-alpine3.20

# Install runtime dependencies for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy production .env file (if exists)
COPY --from=builder /app/.env ./

# Generate Prisma client for production
RUN npx prisma generate

# Optional: Run migrations (often done separately in CI/CD)
# RUN npx prisma migrate deploy

EXPOSE 5000

# Start the production server
CMD ["node", "dist/src/main.js"]