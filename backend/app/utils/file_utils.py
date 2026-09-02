import os
import re

def sanitize_filename(filename: str) -> str:
    filename = os.path.basename(filename)
    filename = re.sub(r"[^\w\.-]", "_", filename)
    return filename

def get_file_extension(filename: str) -> str:
    return os.path.splitext(filename)[1].lower().lstrip(".")
