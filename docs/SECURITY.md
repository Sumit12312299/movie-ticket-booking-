# Security Guidelines & Best Practices

## Authentication & Authorization
- **JWT Lifetimes**: Access tokens expire in 30 minutes; refresh tokens expire in 7 days.
- **Role-Based Access Control (RBAC)**: Strict separation between `customer`, `theatre_manager`, and `admin` roles.
- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds >= 12.

## API Security
- Rate limiting applied to sensitive auth and checkout endpoints.
- CORS restricted to allowed client domains.
- Input validation enforced at the schema layer (Pydantic / Zod).
- SQL / Query injection prevention via ORM parameterized queries.

## Reporting Vulnerabilities
Please report any discovered vulnerabilities to `security@moviebooking.example.com`.
