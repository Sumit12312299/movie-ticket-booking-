# Production Deployment Guide

Guide for deploying the Movie Booking System across containerized and cloud environments.

## Docker Setup
```bash
# Build frontend and backend containers
docker compose -f docker-compose.prod.yml build

# Start services in detached mode
docker compose -f docker-compose.prod.yml up -d
```

## Environment Configuration
Ensure the following variables are configured in production:
- `SECRET_KEY`: Strong cryptographic key for JWT signing
- `DATABASE_URL`: PostgreSQL / MongoDB connection string with connection pooling
- `CORS_ORIGINS`: Restrictive whitelist of trusted domain names
- `PAYMENT_GATEWAY_KEY`: API credentials for Stripe / Razorpay

## Health Check & Monitoring
- Backend health endpoint: `GET /health`
- Prometheus metrics endpoint: `GET /metrics`
