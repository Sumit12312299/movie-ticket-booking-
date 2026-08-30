import time
import threading
from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, max_calls: int = 10, period_seconds: int = 60):
        self.max_calls = max_calls
        self.period    = period_seconds
        self._lock     = threading.Lock()
        self._windows  = defaultdict(deque)

    def is_allowed(self, key: str) -> bool:
        now    = time.monotonic()
        cutoff = now - self.period
        with self._lock:
            window = self._windows[key]
            while window and window[0] < cutoff:
                window.popleft()
            if len(window) >= self.max_calls:
                return False
            window.append(now)
            return True

    def reset(self, key: str) -> None:
        with self._lock:
            self._windows.pop(key, None)
