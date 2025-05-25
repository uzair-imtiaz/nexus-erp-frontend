# 📦 Base stage: Set up Node and workspace files
FROM node:20-alpine AS base

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifest files
COPY package.json package-lock.json ./

# 🔨 Build stage: Install dependencies and build the app
FROM base AS builder

# Install all dependencies including devDependencies
RUN npm ci

# Copy the full source code into the container
COPY . .

# Build the application
RUN npm run build

# 🏁 Production stage: Serve the built application
FROM nginx:alpine AS production

# Copy the built application from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port nginx runs on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 