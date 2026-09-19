import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("api_access")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to track request execution duration and status code."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        
        response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
        logger.info(
            f"{request.method} {request.url.path} -> {response.status_code} "
            f"({process_time:.2f}ms)"
        )
        return response
