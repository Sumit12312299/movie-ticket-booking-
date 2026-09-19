# API Reference

Complete documentation of all available REST endpoints for the Movie Booking System.

## Base URL
`http://localhost:8000/api/v1`

## Endpoints

### Authentication
- `POST /auth/register` - Create a new user account
- `POST /auth/login` - Authenticate and obtain JWT access tokens
- `GET /auth/me` - Retrieve current authenticated user profile
- `POST /auth/refresh` - Refresh access token

### Movies
- `GET /movies` - List movies with pagination, genre, and search filters
- `GET /movies/{id}` - Retrieve details for a specific movie
- `POST /movies` - Add a new movie (Admin only)
- `PUT /movies/{id}` - Update movie details (Admin only)
- `DELETE /movies/{id}` - Remove a movie (Admin only)

### Theatres & Shows
- `GET /theatres` - List theatres by city and location
- `GET /theatres/{id}` - Get theatre details and screens
- `GET /shows` - List shows by movie, theatre, and date
- `GET /shows/{id}` - Get show seat layout and availability

### Bookings & Payments
- `POST /bookings` - Reserve seats and create a pending booking
- `GET /bookings/my-bookings` - List authenticated user's bookings
- `GET /bookings/{id}` - Retrieve booking invoice and QR details
- `POST /payments/checkout` - Process payment for a reservation
- `POST /payments/webhook` - Handle payment gateway status updates
