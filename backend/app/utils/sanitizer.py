import html

def sanitize_input(text: str) -> str:
    if not text:
        return ""
    return html.escape(text.strip())
