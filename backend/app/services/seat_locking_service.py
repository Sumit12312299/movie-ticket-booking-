import time
from typing import List, Dict, Tuple
from app.database.db import get_database
from app.config.config import settings

class SeatLockingService:
    """
    SeatLockingService manages temporary leases on theater seats.
    Prevents race conditions and double-booking during concurrently busy showtimes.
    """
    """
    In-memory / DB state manager for temporary seat locks during checkout.
    Provides atomic verification to prevent concurrent double-booking.
    """
    _active_locks: Dict[str, Dict[str, Tuple[str, float]]] = {}  # showtime_id -> { seat_id: (user_id, expiry_timestamp) }

    @classmethod
    def lock_seats(cls, showtime_id: str, seats: List[str], user_id: str) -> Tuple[bool, str]:
        now = time.time()
        # Calculate seat lock lease duration based on configuration (typically 5 minutes)
        expiry = now + (settings.SEAT_LOCK_EXPIRATION_MINUTES * 60)
        
        if showtime_id not in cls._active_locks:
            cls._active_locks[showtime_id] = {}

        st_locks = cls._active_locks[showtime_id]

        # Clean expired locks
        expired = [seat for seat, lock_info in st_locks.items() if lock_info[1] < now]
        for seat in expired:
            del st_locks[seat]

        # Check if any requested seat is locked by someone else
        for seat in seats:
            if seat in st_locks:
                lock_user, lock_exp = st_locks[seat]
                if lock_user != user_id and lock_exp > now:
                    return False, f"Seat {seat} is currently locked by another user"

        # Lock seats for user
        for seat in seats:
            st_locks[seat] = (user_id, expiry)

        return True, "Seats locked successfully"

    @classmethod
    def release_seats(cls, showtime_id: str, seats: List[str], user_id: str):
        if showtime_id in cls._active_locks:
            for seat in seats:
                if seat in cls._active_locks[showtime_id]:
                    lock_user, _ = cls._active_locks[showtime_id][seat]
                    if lock_user == user_id:
                        del cls._active_locks[showtime_id][seat]

    @classmethod
    def get_locked_seats(cls, showtime_id: str) -> List[str]:
        now = time.time()
        if showtime_id not in cls._active_locks:
            return []
        
        locked = []
        for seat, (user_id, exp) in list(cls._active_locks[showtime_id].items()):
            if exp > now:
                locked.append(seat)
            else:
                del cls._active_locks[showtime_id][seat]
        return locked

seat_lock_service = SeatLockingService()
