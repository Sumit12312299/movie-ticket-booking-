import re

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^[6-9]\d{9}$")

def is_valid_email(email: str) -> bool:
    return bool(EMAIL_REGEX.match(email.strip())) if email else False

def is_valid_phone(phone: str) -> bool:
    return bool(PHONE_REGEX.match(phone.strip())) if phone else False

def is_valid_booking_ref(code: str) -> bool:
    return bool(code and len(code) == 8 and code.isalnum())
