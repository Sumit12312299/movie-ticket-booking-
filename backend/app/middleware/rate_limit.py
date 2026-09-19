import time
from collections import defaultdict
from fastapi import HTTPException, status, Request

class InMemoryRateLimiter:
    """Simple sliding window rate limiter for critical routes."""

    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.client_records = defaultdict(list)

    def check(self, request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start = now - 60

        # Purge timestamps outside the 1-minute window
        self.client_records[client_ip] = [
            ts for ts in self.client_records[client_ip] if ts > window_start
        ]

        if len(self.client_records[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again in a minute."
            )

        self.client_records[client_ip].append(now)
