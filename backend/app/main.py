import logging
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config.settings import settings
from app.database.mongodb import mongodb
from app.routers.auth_router import router as auth_router
from app.routers.movie_router import router as movie_router
from app.routers.theatre_router import router as theatre_router
from app.routers.show_router import router as show_router
from app.routers.booking_router import router as booking_router
from app.routers.admin_router import router as admin_router
from app.routers.payment_router import router as payment_router
from app.routers.review_router import router as review_router
from app.routers.notification_router import router as notification_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await mongodb.connect()
    logger.info("Application started successfully.")
    yield
    await mongodb.close()
    logger.info("Application shut down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A professional movie ticket booking system API similar to BookMyShow.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_router)
app.include_router(movie_router)
app.include_router(theatre_router)
app.include_router(show_router)
app.include_router(booking_router)
app.include_router(admin_router)
app.include_router(payment_router)
app.include_router(review_router)
app.include_router(notification_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to the Movie Ticket Booking API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint to verify backend operational readiness."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected" if mongodb.client else "disconnected"
    }
