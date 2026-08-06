import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "BookTicket API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    # Secret key for signing JWT tokens in auth services
    SECRET_KEY: str = "c1n3m4_s3cr3t_jwt_k3y_998877665544332211"
    # Hashing algorithm used to encode/decode tokens
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # MongoDB Config and connection settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "movieticket_db")

    class Config:
        case_sensitive = True

settings = Settings()
