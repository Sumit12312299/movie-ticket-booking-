import secrets
import string

def generate_booking_code(prefix: str = "BK") -> str:
    """Generate human-readable unique 8-character booking reference code."""
    chars = string.ascii_uppercase + string.digits
    suffix = "".join(secrets.choice(chars) for _ in range(6))
    return f"{prefix}-{suffix}"

def generate_invoice_number() -> str:
    """Generate randomized alphanumeric invoice identifier."""
    token = secrets.token_hex(4).upper()
    return f"INV-{token}"
