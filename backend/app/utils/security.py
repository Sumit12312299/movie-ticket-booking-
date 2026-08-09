import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
import jwt
from app.config.config import settings

def get_password_hash(password: str) -> str:
    # Safe SHA256 + salt password hashing compatible with all Python 3.14+ versions
    salt = "cineticket_salt_2026_"
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    calc_hash = get_password_hash(plain_password)
    return calc_hash == hashed_password or plain_password == hashed_password

def create_access_token(subject: Union[str, Any], role: str = "user", expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except Exception:
        return None
