# Multi-stage build for React app + Node.js proxy server
FROM node:18-alpine AS builder

# Build React app
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
COPY server.js ./
RUN npm ci --only=production

# Copy built React app from builder
COPY --from=builder /app/build ./build

# Install serve to serve the React app
RUN npm install -g serve

# Expose ports
EXPOSE 3000 3001

# Create a start script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node server.js &' >> /app/start.sh && \
    echo 'serve -s build -l 3000' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
