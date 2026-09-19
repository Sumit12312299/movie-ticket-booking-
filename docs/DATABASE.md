# Database Schema & Data Models

## Entity Relationship Overview

```
[Users] 1 --- * [Bookings]
[Movies] 1 --- * [Shows]
[Theatres] 1 --- * [Screens] 1 --- * [Shows]
[Shows] 1 --- * [Seats]
[Bookings] 1 --- 1 [Payments]
```

## Key Indexes
- `users(email)`: Unique index for authentication lookup.
- `shows(movie_id, theatre_id, start_time)`: Composite index for fast scheduling queries.
- `bookings(user_id, status)`: Fast retrieval of user booking histories.
- `seats(show_id, seat_number)`: Atomic lock enforcement during seat reservation.
