import re
from typing import Tuple

def validate_password_strength(password: str) -> Tuple[bool, str]:
    """Validate password against complexity rules."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"[0-9]", password):
        return False, "Password must contain at least one digit."
    return True, "Password meets strength requirements."

def sanitize_search_query(query: str) -> str:
    """Sanitize text input for search operations."""
    return re.sub(r"[^\w\s-]", "", query).strip()
