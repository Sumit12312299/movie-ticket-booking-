import re

def normalize_whitespace(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def extract_digits(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\D', '', text)
