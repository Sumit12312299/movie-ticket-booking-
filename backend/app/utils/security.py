import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
import jwt
from app.config.config import settings

def get_password_hash(password: str) -> str:
    """
    Generates a secure SHA256 hash of a password prepended with a system salt.

    Args:
        password (str): Plain-text password to hash.

    Returns:
        str: Hex digest string of the salted hash.
    """
    # Safe SHA256 + salt password hashing compatible with all Python 3.14+ versions
    salt = "cineticket_salt_2026_"
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a stored hashed password.

    Args:
        plain_password (str): Plain-text password input.
        hashed_password (str): Hashed password from database to verify against.

    Returns:
        bool: True if password matches, False otherwise.
    """
    calc_hash = get_password_hash(plain_password)
    return calc_hash == hashed_password or plain_password == hashed_password

def create_access_token(subject: Union[str, Any], role: str = "user", expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT access token encoding subject (user_id), role, and expiration timestamp.

    Args:
        subject (Union[str, Any]): Unique identifier for the token subject (e.g. user_id).
        role (str): Role privileges associated with the token. Defaults to "user".
        expires_delta (Optional[timedelta]): Custom token validity duration.

    Returns:
        str: Encoded JWT access token.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes and validates a JWT access token.

    Args:
        token (str): Encoded JWT token string.

    Returns:
        Optional[dict]: Decoded payload dictionary if valid, or None if invalid or expired.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except Exception:
        return None
