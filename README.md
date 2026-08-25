# BookTicket - Full Stack Movie Ticket Booking Platform

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717.svg?style=flat&logo=github)](https://github.com/Sumit12312299/movie-ticket-booking-.git)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![JWT Auth](https://img.shields.io/badge/Security-JWT_Auth-000000.svg?style=flat&logo=jsonwebtokens)](https://jwt.io/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/Sumit12312299/movie-ticket-booking-.git)
[![Code Quality](https://img.shields.io/badge/Code_Quality-Verified-success.svg?style=flat&logo=githubactions)](https://github.com/Sumit12312299/movie-ticket-booking-.git)

🔗 **GitHub Repository Link**: [https://github.com/Sumit12312299/movie-ticket-booking-.git](https://github.com/Sumit12312299/movie-ticket-booking-.git)

A complete, production-ready Full Stack Web Application designed for online movie ticket booking, seat reservation, and cinema management. Built with **FastAPI**, **MongoDB**, **React**, and **Tailwind CSS**.

### 🌟 Resilient Offline Fallback Architecture
BookTicket implements a dual-mode database manager. If MongoDB is unavailable during startup, the application auto-switches to an embedded in-memory data store, guaranteeing zero startup downtime and continuous availability for testing.

---

## 📄 Project Documentation

### 1. Problem Statement
Online ticket booking platforms frequently face challenges regarding concurrent seat reservations, dynamic screening schedules, double-booking prevention, real-time metrics for theater managers, and responsive user experience across devices. **BookTicket** addresses these challenges by implementing an asynchronous backend with temporary seat locking mechanisms, role-based access control, digital E-ticket generation with QR codes, and analytical dashboard metrics.

---

### 2. Complete Features List

#### 🔐 Authentication & User Management
- **User Registration & Login**: JWT token-based authentication with password hashing using `bcrypt`.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `User` and `Admin` roles.
- **User Profile & Favorites**: Manage personal profile, active bookings, ticket history, and saved wishlist movies.

#### 🎬 Movie Catalog & Discovery
- **Catalog Management**: Full CRUD operations for movies (Title, Synopsis, Genre, Duration, Poster, Banner, YouTube Trailer embeds).
- **Search & Filtering**: Real-time title search, genre filtering (Sci-Fi, Action, Drama, etc.), and status filter (Now Showing / Coming Soon).
- **Ratings & Reviews**: Users can rate movies (1.0 to 5.0 stars) and post detailed audience reviews.

#### 🎟️ Showtime & Interactive Seat Reservation Engine
- **Showtime Schedules**: Filter screening slots by Date (Today, Tomorrow, Day 3) and Screen Format (IMAX 3D, VIP Dolby Atmos, Standard 2D).
- **Interactive Seat Map**: Graphical grid (Rows A-H, Seats 1-12) displaying Available, Selected, Reserved, and VIP seats.
- **Concurrent Double-Booking Prevention**: Temporary 5-minute seat locking mechanism during checkout.

#### 💳 Payment Gateway Simulation & E-Ticket Generation
- **Order Summary**: Promo code discount validation (`CINEMA10` for 10% off), subtotal & convenience fee breakdown.
- **Payment Options**: Card, UPI/QR, Net Banking, and Digital Wallet checkout simulation.
- **Digital Ticket Pass**: Generates digital E-Tickets complete with reference IDs, seat details, and scannable QR Code.

#### 📊 Admin Management & Analytics Portal
- **KPI Metrics Dashboard**: Real-time tracking of Total Revenue, Total Tickets Sold, Active Movies, and Registered Users.
- **Revenue Distribution Charts**: Interactive genre revenue breakdown visual charts.
- **Inventory & Showtime Control**: Modal forms to add new movies and schedule theater screening slots.

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |   React 19 + Tailwind |
                                  |   Single Page App     |
                                  +-----------+-----------+
                                              |
                                              | Axios REST HTTP / Bearer JWT
                                              v
                                  +-----------------------+
                                  |    FastAPI Backend    |
                                  | (Pydantic, PyJWT,     |
                                  |  Seat Lock Service)   |
                                  +-----------+-----------+
                                              |
                                              | Motor / Async PyMongo
                                              v
                                  +-----------------------+
                                  |    MongoDB Database   |
                                  | (Users, Movies, Show- |
                                  |  times, Bookings)     |
                                  +-----------------------+
```

### 🚀 Future System Design (Distributed & High-Availability Architecture)
1. **Distributed Locking (Redis Redlock)**: Replace local seat lock memory manager with Redis Redlock cluster to coordinate atomic seat reservations across multi-region API pods.
2. **Read-Heavy Caching**: Cache movie catalogs and showtime metadata in Redis with TTL invalidation to support 100k+ request/sec peaks.
3. **Asynchronous Processing (RabbitMQ / Celery)**: Offload PDF ticket pass rendering and email notifications to background worker queues.

---

## 📁 Project Folder Structure

```
movie ticket booking/
├── backend/
│   ├── app/
│   │   ├── config/
│   │   │   └── config.py         # App environment & settings
│   │   ├── database/
│   │   │   └── db.py             # MongoDB Motor connection & Fallback DB
│   │   ├── models/
│   │   │   ├── user.py           # User Pydantic models
│   │   │   └── movie.py          # Movie Pydantic models
│   │   ├── routes/
│   │   │   ├── admin_routes.py   # Admin metrics & management APIs
│   │   │   ├── auth_routes.py    # Authentication & Profile APIs
│   │   │   ├── booking_routes.py # Booking, seat lock & E-ticket APIs
│   │   │   ├── movie_routes.py   # Movie CRUD, search & review APIs
│   │   │   └── showtime_routes.py# Showtime & seat availability APIs
│   │   ├── schemas/
│   │   │   ├── booking_schema.py # Booking request & response validation
│   │   │   ├── movie_schema.py   # Movie & review validation schemas
│   │   │   ├── showtime_schema.py# Showtime slot schemas
│   │   │   └── user_schema.py    # Auth & token validation schemas
│   │   ├── services/
│   │   │   ├── auth_service.py   # JWT authorization dependency
│   │   │   └── seat_locking_service.py # 5-min concurrent seat lock manager
│   │   ├── utils/
│   │   │   ├── logger.py         # Application logger
│   │   │   └── security.py       # Password hashing & JWT helpers
│   │   ├── main.py               # FastAPI entry point & CORS
│   │   └── seed.py               # Startup database seeding script
│   ├── .env                      # Environment variables
│   ├── requirements.txt          # Python dependencies
│   └── run.py                    # Uvicorn server launcher
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx        # Footer component
    │   │   ├── MovieCard.jsx     # Movie poster card component
    │   │   ├── Navbar.jsx        # Navigation header & live search
    │   │   ├── SeatMap.jsx       # Interactive theater seat map
    │   │   ├── TicketPass.jsx    # Digital E-Ticket pass with QR Code
    │   │   └── TrailerModal.jsx  # YouTube trailer modal
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Authentication context provider
    │   │   └── NotificationContext.jsx # Toast notification manager
    │   ├── layouts/
    │   │   └── MainLayout.jsx    # Application shell layout
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx# Admin metrics & inventory portal
    │   │   ├── AuthPage.jsx      # Login & Registration page
    │   │   ├── BookingConfirmationPage.jsx # Ticket confirmation page
    │   │   ├── CheckoutPage.jsx  # Payment checkout gateway page
    │   │   ├── HomePage.jsx      # Home hero slider & movies grid
    │   │   ├── MovieDetailsPage.jsx # Movie specs & user reviews page
    │   │   ├── SeatSelectionPage.jsx # Interactive seat locking page
    │   │   ├── ShowtimeSelectionPage.jsx # Showtime date & venue picker
    │   │   ├── SystemDesignPage.jsx # System architecture documentation
    │   │   └── UserDashboard.jsx # My Bookings & Wishlist page
    │   ├── services/
    │   │   └── api.js            # Axios HTTP client with JWT interceptor
    │   ├── App.jsx               # React Router routes setup
    │   ├── index.css             # Tailwind CSS & design system
    │   └── main.jsx              # React app mounting root
    ├── package.json              # Frontend npm dependencies
    └── vite.config.js            # Vite build & proxy config
```

---

## 🗄️ Database Schemas & Collections

### 1. `users` Collection
```json
{
  "_id": "user_id_string",
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "$2b$12$hashed_password...",
  "role": "user",
  "created_at": "2026-07-29T12:00:00",
  "favorites": ["m_dune2"]
}
```

### 2. `movies` Collection
```json
{
  "_id": "m_dune2",
  "title": "Dune: Part Two",
  "synopsis": "Paul Atreides unites with Chani and the Fremen...",
  "genre": ["Sci-Fi", "Adventure"],
  "language": "English",
  "duration_mins": 166,
  "rating": 4.9,
  "reviews_count": 128,
  "release_date": "2026-03-01",
  "poster_url": "https://...",
  "banner_url": "https://...",
  "trailer_url": "https://www.youtube.com/embed/Way9Dexny3w",
  "status": "now_showing",
  "cast": ["Timothée Chalamet", "Zendaya"],
  "director": "Denis Villeneuve"
}
```

### 3. `showtimes` Collection
```json
{
  "_id": "st_501",
  "movie_id": "m_dune2",
  "movie_title": "Dune: Part Two",
  "theater_name": "CinePlex Grand IMAX",
  "screen_type": "IMAX 3D Laser",
  "show_date": "2026-07-29",
  "show_time": "06:00 PM",
  "regular_price": 16.50,
  "vip_price": 24.00,
  "booked_seats": ["C5", "C6"]
}
```

### 4. `bookings` Collection
```json
{
  "_id": "booking_id_string",
  "booking_reference": "CT-X892A1",
  "user_id": "user_id_string",
  "user_name": "Jane Doe",
  "user_email": "jane@example.com",
  "movie_id": "m_dune2",
  "movie_title": "Dune: Part Two",
  "theater_name": "CinePlex Grand IMAX",
  "show_date": "2026-07-29",
  "show_time": "06:00 PM",
  "screen_type": "IMAX 3D Laser",
  "seats": ["D4", "D5"],
  "total_amount": 33.00,
  "payment_method": "Credit Card",
  "status": "CONFIRMED",
  "booking_time": "2026-07-29 18:25:00",
  "qr_code_data": "data:image/png;base64,..."
}
```

---

## 📡 API Endpoints Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Login and obtain JWT bearer token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `POST` | `/api/auth/favorites/{movie_id}` | Authenticated | Toggle movie favorite status |
| `GET` | `/api/movies` | Public | List movies with search, genre & status filters |
| `GET` | `/api/movies/{id}` | Public | Get single movie details |
| `POST` | `/api/movies` | Admin | Create new movie entry |
| `PUT` | `/api/movies/{id}` | Admin | Update existing movie |
| `DELETE`| `/api/movies/{id}` | Admin | Delete movie entry |
| `GET` | `/api/movies/{id}/reviews` | Public | List audience reviews for movie |
| `POST` | `/api/movies/{id}/reviews` | Authenticated | Submit movie review and rating |
| `GET` | `/api/showtimes` | Public | Get showtimes filtered by movie and date |
| `POST` | `/api/showtimes` | Admin | Create showtime screening slot |
| `POST` | `/api/bookings/lock-seats` | Authenticated | Lock seats for 5 minutes during checkout |
| `POST` | `/api/bookings` | Authenticated | Confirm payment and issue digital ticket |
| `GET` | `/api/bookings/my-bookings` | Authenticated | Get user's active & past tickets |
| `DELETE`| `/api/bookings/{id}/cancel` | Authenticated | Cancel booking and release seats |
| `GET` | `/api/admin/stats` | Admin | Get revenue stats & dashboard analytics |
| `GET` | `/api/admin/bookings` | Admin | Get all system customer bookings |

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Seed initial database records
python -m app.seed

# Run FastAPI server
python run.py
```
*Backend API will run on `http://127.0.0.1:8000` and Swagger docs at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend application will run on `http://localhost:5173`.*

---

## 🔑 Demo Login Credentials

Pre-seeded out-of-the-box demo accounts for testing:

- **Admin Account**:
  - Email: `admin@bookticket.com`
  - Password: `admin123`
  - *Access*: Admin Portal, KPI Metrics, Add/Edit Movies, Schedule Showtimes.

- **Standard User Account**:
  - Email: `user@bookticket.com`
  - Password: `user123`
  - *Access*: Movie Browse, Seat Selection, Payment Checkout, Digital E-Tickets.

---

## 🤝 Contributing & Git Workflow

All changes are integrated incrementally via small, atomic commits to track modular improvements. To contribute:
1. Ensure the code conforms to standard PEP 8 styling.
2. Run tests to confirm zero regressions before committing.
3. Code comments, Pydantic docstrings, and React JSDocs have been standardized across components to improve codebase maintainability.

---

## 🛠️ Developer Mode & High Availability

The backend includes logging utilities that trace database and application health. If database connections decay, the server remains fully operational under local test scenarios.

---

## 🧪 Testing Guidelines

For local verification of the backend API and helper libraries, the application leverages `pytest`:
- **Unit Tests**: Located inside `backend/tests/` directory to verify endpoints and business helper functions.
- **Run Tests**: Run `pytest` within the `backend` folder to verify the health and correctness of the backend API.

