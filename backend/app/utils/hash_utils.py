import hashlib

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def compute_short_hash(text: str, length: int = 8) -> str:
    full_hash = compute_sha256(text)
    return full_hash[:length]
