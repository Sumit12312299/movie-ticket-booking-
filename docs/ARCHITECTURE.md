# CINEPASS System Architecture

## Overview

CINEPASS is designed with a modern decoupled client-server architecture built for high concurrency seat bookings, minimal latency, and an engaging cinema discovery experience.

```text
┌────────────────────────────────────────────────────────┐
│                   React 18 + Vite                      │
│       (Glassmorphism UI, Seat Visualizer, Axios)       │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (JWT Bearer)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routers (Auth, Movie, Theatre, Show, Booking)   │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │  Services Layer (Validation, Business Rules)    │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │  Repository Layer (Async Mongo Motor Queries)    │  │
│  └────────────────────────┬─────────────────────────┘  │
└───────────────────────────┼────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                   MongoDB Database                     │
│    (Users, Movies, Theatres, Screens, Shows, Bookings) │
└────────────────────────────────────────────────────────┘
```

## Core Components

1. **Presentation Layer (Frontend)**:
   - Client-side routing with React Router DOM.
   - Global auth state via React Context API.
   - Dynamic SVG & CSS Grid-based seat layout generator.

2. **Controller Layer (Routers)**:
   - Pure FastAPI endpoint controllers validating request bodies with Pydantic.
   - Dependency injection for authentication, roles, and database sessions.

3. **Domain & Service Layer**:
   - Manages state machines for seat reservations (AVAILABLE -> SELECTED -> BOOKED).
   - Generates unique ticket references and QR codes.

4. **Data Access Layer (Repositories)**:
   - Isolates MongoDB queries and projections using Motor async driver.
