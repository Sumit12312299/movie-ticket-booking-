import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application Settings configuration.
    Uses pydantic-settings to automatically parse system environment variables
    with default values for fallback configuration.
    """
    # General API Configuration
    PROJECT_NAME: str = "BookTicket Movie Booking API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bookticket_jwt_super_secret_key_2026_x99")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # Token expiration duration: 7 days
    
    # MongoDB Database Configuration
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "movieticket_db")
    
    # Core Service Lock Rules
    SEAT_LOCK_EXPIRATION_MINUTES: int = 5  # Temporary ticket seat lock duration (5 minutes)

    class Config:
        case_sensitive = True

settings = Settings()
