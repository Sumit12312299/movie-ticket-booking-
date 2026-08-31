# CineTicket REST API Specification

## Base URL
/api/v1

## Endpoints Summary

### Auth
- POST /auth/login - User login
- POST /auth/register - User registration

### Movies
- GET /movies - List all active movies
- GET /movies/:id - Get movie details

### Bookings
- POST /bookings - Create new ticket booking
- GET /bookings/user - Retrieve user booking history
