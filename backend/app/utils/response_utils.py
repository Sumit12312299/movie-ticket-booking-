from typing import Any, Optional

def success_response(data: Any = None, message: str = "Success", code: int = 200) -> dict:
    return {
        "status": "success",
        "code": code,
        "message": message,
        "data": data
    }

def error_response(message: str = "An error occurred", code: int = 400, details: Optional[Any] = None) -> dict:
    return {
        "status": "error",
        "code": code,
        "message": message,
        "details": details
    }
