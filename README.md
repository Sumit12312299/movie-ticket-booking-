# 🎬 CinePass - Movie Ticket Booking System

A professional, full-stack, industry-grade Movie Ticket Booking System inspired by BookMyShow. Built with clean architecture, single-responsibility principle, secure JWT authentication, interactive seat selection, and rich administrative analytics.

---

## 🚀 Key Features

### 👤 Customer Capabilities
- **Authentication**: Secure JWT-based Login, Registration, Profile Management, and Password Hashing with bcrypt.
- **Movie Browsing**: Dynamic search by title, genre filtering, and language filtering.
- **Movie Details & Reviews**: View cast/description/duration, read audience reviews, and post ratings.
- **Theatre & Showtimes**: Select preferred cinema hall, screen, and date/time.
- **Interactive Seat Selection**: Real-time seat layout visualizer (available, selected, booked states).
- **Instant Checkout**: Simulated payment gateway integration (UPI, Credit/Debit Card, Net Banking).
- **Printable Ticket**: Confirmed booking view with printable ticket card and unique QR code.
- **Booking Management**: View booking history and cancel tickets prior to show time.

### 🛡️ Admin Capabilities
- **Executive Dashboard**: Real-time revenue metrics, aggregate booking stats, active catalog counters.
- **Catalog Management (CRUD)**: Create, update, and remove movies from the public catalog.
- **Theatre & Screen Management**: Add cinema halls, define screens, and custom seat capacities.
- **Show Scheduling**: Schedule movie shows across screens with pricing and auto-generated seat layouts.
- **User Oversight**: Inspect registered user accounts and inspect system-wide bookings.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Python FastAPI
- **Database**: MongoDB (Async Motor driver)
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Security**: JWT (python-jose), Passlib (bcrypt password hashing)
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18 (Vite bundler)
- **Styling**: Tailwind CSS with custom Glassmorphism aesthetic
- **Routing**: React Router DOM v6
- **API Client**: Axios (with global JWT request interceptor & 401 handling)
- **Icons**: Lucide React

---

## 📂 Architecture & Folder Structure

```text
Movie_Booking_System/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT handling, bcrypt password hashing
│   │   ├── config/        # Environment variables & Pydantic settings
│   │   ├── database/      # Motor MongoDB connection manager
│   │   ├── dependencies/  # FastAPI dependency injection (get_db, get_current_user)
│   │   ├── models/        # Collection schema representations
│   │   ├── repositories/  # Data access layer (UserRepo, MovieRepo, ShowRepo, etc.)
│   │   ├── routers/       # Controller layer (Auth, Movie, Theatre, Show, Booking, Admin)
│   │   ├── schemas/       # Input/Output validation Pydantic models
│   │   ├── services/      # Business logic layer (AuthService, BookingService, etc.)
│   │   ├── utils/         # Seed script & helpers
│   │   └── main.py        # FastAPI entry point
│   ├── .env
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (Navbar, Footer, SeatLayout, MovieCard, etc.)
    │   ├── context/       # AuthContext for state management
    │   ├── pages/         # Page components (Home, Details, SeatSelection, Checkout, Admin)
    │   ├── services/      # Axios API instance
    │   ├── App.jsx        # Routing configuration
    │   └── index.css      # Design system & Tailwind directives
    └── package.json
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance running locally on `mongodb://localhost:27017` or MongoDB Atlas URI.

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m app.utils.seed    # Seed sample database
uvicorn app.main:app --reload --port 8000
```
> API Documentation available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> App available at: `http://localhost:5173`

---

## 🔑 Demo Seed Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@cinema.com` | `admin123` |
| **Customer** | `john@example.com` | `john123` |

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new account | Public |
| POST | `/api/auth/login/json` | Authenticate user | Public |
| GET | `/api/movies/` | List all active movies | Public |
| GET | `/api/movies/search` | Search & filter movies | Public |
| GET | `/api/shows/movie/{id}` | Get showtimes for a movie | Public |
| GET | `/api/shows/{id}/seats` | Get seat layout for a show | Public |
| POST | `/api/bookings/` | Book selected seats | Customer |
| POST | `/api/payments/` | Process ticket payment | Customer |
| GET | `/api/admin/dashboard` | Executive metrics & stats | Admin |
