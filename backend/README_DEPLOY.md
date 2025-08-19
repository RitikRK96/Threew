Backend Deployment Guide

Prerequisites
- MongoDB connection string (MONGO_URI)
- Allowed frontend origin (CLIENT_ORIGIN)
- Optional: TRUST_PROXY=1 if behind reverse proxy

Environment variables
Create a .env in backend/ with:

NODE_ENV=production
PORT=5000
HOST=0.0.0.0
CLIENT_ORIGIN=https://threew.lancway.com/
MONGO_URI=your-mongo-uri
TRUST_PROXY=1

Start with Node directly
cd backend
npm ci --only=production
node server.js

Docker build and run
cd backend
docker build -t leaderboard-backend:latest .
docker run -d --name leaderboard-backend --env-file .env -p 5000:5000 leaderboard-backend:latest

Healthcheck
- GET /health returns { status: "ok" }
- Socket.IO served at same host/port

Reverse proxy (NGINX)
server {
  listen 80;
  server_name api.your-domain.com;
  location / {
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_pass http://127.0.0.1:5000;
  }
}


