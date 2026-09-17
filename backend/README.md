# Backend - Movie Booking System API

FastAPI-powered asynchronous REST API with MongoDB (Motor) for cinema showtimes, seat reservations, booking lifecycle, and authentication.

## 🚀 Features

- **JWT Authentication & Role-based Access**: Secure user registration, login, token refresh, and admin capabilities.
- **Movie Catalog & Showtime Scheduling**: Endpoints for browsing movies, theatres, screens, and show timings.
- **Seat Reservation Engine**: Concurrency-safe seat locking and reservation system.
- **Booking & Payments**: Order generation, checkout simulation, and booking history retrieval.
- **MongoDB Async Driver**: Motor-driven high performance async database operations.

## 🛠️ Tech Stack

- **FastAPI**: Modern Python web framework for APIs.
- **Motor**: Async MongoDB driver for Python.
- **Pydantic v2**: Data validation and settings management.
- **Passlib & Python-JOSE**: Bcrypt password hashing and JWT token handling.
- **Uvicorn**: Lightning-fast ASGI web server.

## 🏁 Quickstart

```bash
# 1. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup environment variables
cp .env.example .env

# 4. Seed sample cinema and movie data
python -m app.utils.seed

# 5. Start development server
uvicorn app.main:app --reload --port 8000
```

## 📖 API Documentation

Once the server is running, visit:
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **ReDoc UI**: `http://localhost:8000/redoc`
