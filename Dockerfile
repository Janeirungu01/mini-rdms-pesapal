# ---------- Frontend Build Stage ----------
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build


# ---------- Backend Stage ----------
FROM node:18-alpine

WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Copy built frontend into backend (served as static files)
COPY --from=frontend-build /app/frontend/build ./public

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "rdms/server.js"]
