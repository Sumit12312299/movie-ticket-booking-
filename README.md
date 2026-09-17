# 🎬 CINEPASS - Movie Ticket Booking System

A professional, full-stack, industry-grade Movie Ticket Booking Platform inspired by BookMyShow and AMC Theatres. Built with a clean architecture, asynchronous MongoDB integration, role-based JWT authentication, interactive seat mapping, real-time booking lifecycle, and modern Glassmorphic dark aesthetics.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Authentication & Profiles**: Secure JWT-based registration, login, profile management, and bcrypt password hashing.
- **Cinematic Discovery**: Hero carousel, search by title, and multi-genre/language filter chips.
- **Movie Details & Media**: Detailed synopsis, trailer preview modals, cast members, and user reviews.
- **Theatre & Showtimes**: Multi-city selector, cinema hall locator, interactive date calendar, and time slot picker.
- **Interactive Seat Map**: Real-time visual seat layout with VIP Recliners, Premium Gold, and Standard Silver tiers.
- **Seamless Checkout**: Simulated payment gateway (UPI, Credit/Debit Card, Net Banking) with discount voucher support.
- **Digital E-Ticket Pass**: Instant booking confirmation with printable boarding-pass-style ticket and QR code.
- **Booking History**: Real-time ticket history with active status tags and cancellation options.

### 🛡️ Admin & Cinema Management
- **Executive Analytics**: Real-time revenue metrics, booking volumes, and active catalogue counts.
- **Catalogue Management (CRUD)**: Create, update, and manage movie releases.
- **Theatre & Screen Management**: Configure cinema halls, screens, and custom seat matrix dimensions.
- **Show Scheduling**: Schedule movie screenings across halls with dynamic pricing tiers.
- **User Oversight**: Inspect registered user accounts and system-wide transactions.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Python FastAPI (Async ASGI)
- **Database**: MongoDB (Async Motor driver)
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Security**: JWT (python-jose), Passlib (bcrypt)
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18 (Vite bundler)
- **Styling**: Tailwind CSS & Glassmorphism design system
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT interceptors & token handling
- **Icons**: Lucide React
- **Typography**: Google Fonts (Cinzel, Bebas Neue, Outfit, Inter)

---

## 📂 Architecture & Folder Structure

```text
Movie_Booking_System/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT tokens & bcrypt password hashing
│   │   ├── config/        # Environment variables & Pydantic settings
│   │   ├── database/      # Motor MongoDB async client
│   │   ├── dependencies/  # FastAPI DI (get_db, get_current_user, get_current_admin)
│   │   ├── models/        # MongoDB collection schemas
│   │   ├── repositories/  # Data access layer
│   │   ├── routers/       # API endpoints (Auth, Movies, Theatres, Shows, Bookings, Admin)
│   │   ├── schemas/       # Request & response Pydantic models
│   │   ├── services/      # Core business logic
│   │   ├── utils/         # Database seeding script & utilities
│   │   └── main.py        # FastAPI application entrypoint
│   ├── .env.example       # Backend environment variables template
│   ├── README.md          # Backend specific documentation
│   └── requirements.txt   # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (Navbar, Footer, SeatLayout, MovieCard, etc.)
    │   ├── constants/     # Global cities, genres, languages, and pricing constants
    │   ├── context/       # AuthContext for global user state
    │   ├── pages/         # Application views (Home, Details, SeatSelection, Checkout, etc.)
    │   ├── services/      # Axios API service instance
    │   ├── App.jsx        # Route definitions
    │   └── index.css      # Cinematic theme & Tailwind utilities
    ├── .env.example       # Frontend environment variables template
    ├── README.md          # Frontend specific documentation
    └── package.json       # Node.js dependencies
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017` or a MongoDB Atlas connection URI.

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python -m app.utils.seed    # Seed sample cinema & movie catalogue
uvicorn app.main:app --reload --port 8000
```
> Interactive API Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
> Application available at: `http://localhost:5173`

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@cinema.com` | `admin123` |
| **Customer** | `john@example.com` | `john123` |

---

## 📡 Core API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Application health check | Public |
| `POST` | `/api/auth/register` | Register new account | Public |
| `POST` | `/api/auth/login/json` | User authentication | Public |
| `GET` | `/api/movies/` | List active movies | Public |
| `GET` | `/api/movies/search` | Search & filter movies | Public |
| `GET` | `/api/shows/movie/{id}` | Get showtimes for a movie | Public |
| `GET` | `/api/shows/{id}/seats` | Fetch interactive seat layout | Public |
| `POST` | `/api/bookings/` | Reserve selected seats | Customer |
| `POST` | `/api/payments/` | Process simulated payment | Customer |
| `GET` | `/api/admin/dashboard` | Executive metrics & statistics | Admin |
