import base64
import json
import time
from typing import Any, Optional

def decode_token_payload_unverified(token: str) -> Optional[dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        payload = parts[1]
        payload += "=" * (-len(payload) % 4)
        decoded = base64.urlsafe_bdecode(payload)
        return json.loads(decoded)
    except Exception:
        return None

def is_token_expired(token: str, buffer_seconds: int = 0) -> bool:
    payload = decode_token_payload_unverified(token)
    if not payload or "exp" not in payload:
        return True
    return time.time() >= (payload["exp"] - buffer_seconds)
