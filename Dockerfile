# ---------- Frontend Build Stage ----------
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy the entire frontend folder first
COPY frontend/ ./  

# Install dependencies and build
RUN npm install
RUN npm run build

# ---------- Backend Stage ----------
FROM node:18-alpine

WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend/ ./  

# Copy frontend build from previous stage into backend
COPY --from=frontend-build /app/frontend/build ./public

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "rdms/server.js"]
