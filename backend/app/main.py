import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.config.config import settings
from app.database.db import connect_to_mongo, close_mongo_connection
from app.routes.auth_routes import router as auth_router
from app.routes.movie_routes import router as movie_router
from app.routes.showtime_routes import router as showtime_router
from app.routes.booking_routes import router as booking_router
from app.routes.admin_routes import router as admin_router
from app.seed import seed_data
from app.utils.logger import logger

"""
BookTicket Entrypoint Module.
Sets up the FastAPI application instance, registers global middlewares (CORS, GZip compression),
registers startup/shutdown lifecycle hooks, and hooks up the routing endpoints.
"""
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-Ready Movie Ticket Booking API with JWT Auth, Seat Locking, and Admin Analytics",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Compression Middleware for ultra-fast API payloads
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS Configuration
# Allowed CORS origins for development, staging, and wildcard fallback.
# In a strict production environment, wildcard '*' should be restricted to trusted domains.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup & Shutdown Lifespan Events
@app.on_event("startup")
async def startup_event():
    logger.info("Initializing BookTicket API server...")
    await connect_to_mongo()
    await seed_data()
    logger.info("BookTicket API server ready to accept requests!")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Global Error Handling
from fastapi import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    """Formats validation and generic HTTP errors into clean JSON payloads."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status": "error"}
    )

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(movie_router, prefix=settings.API_V1_STR)
app.include_router(showtime_router, prefix=settings.API_V1_STR)
app.include_router(booking_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }
