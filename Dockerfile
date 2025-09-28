FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code and build
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Install serve package globally
RUN npm install -g serve

# Copy only built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expose port 80
EXPOSE 80

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "80"]