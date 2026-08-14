# =====================
# Stage 1: Build
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build
RUN npm run build

# =====================
# Stage 2: Production
# =====================
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

# Copy package files and install production deps only
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads && chown nestjs:nestjs uploads

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/settings/check-registration || exit 1

# Start application
CMD ["node", "dist/main"]
