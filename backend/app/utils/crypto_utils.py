import secrets
import hashlib

def generate_random_token(length: int = 32) -> str:
    return secrets.token_hex(length)

def hash_string(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()
