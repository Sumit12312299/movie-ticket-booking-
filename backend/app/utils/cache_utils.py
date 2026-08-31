import time
from typing import Any, Optional

class SimpleTTLCache:
    def __init__(self, default_ttl: int = 300):
        self.default_ttl = default_ttl
        self._cache = {}

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        expiry = time.time() + (ttl if ttl is not None else self.default_ttl)
        self._cache[key] = (value, expiry)

    def get(self, key: str) -> Optional[Any]:
        if key not in self._cache:
            return None
        value, expiry = self._cache[key]
        if time.time() > expiry:
            del self._cache[key]
            return None
        return value
