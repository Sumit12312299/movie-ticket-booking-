from __future__ import annotations
from typing import Any
from sqlalchemy.orm import Query

_MAX_PER_PAGE = 100

def paginate(query: Query, page: int = 1, per_page: int = 20) -> dict[str, Any]:
    page     = max(1, int(page))
    per_page = max(1, min(_MAX_PER_PAGE, int(per_page)))
    total    = query.count()
    items    = query.offset((page - 1) * per_page).limit(per_page).all()
    total_pages = max(1, -(-total // per_page))

    return {
        "items":       items,
        "total":       total,
        "page":        page,
        "per_page":    per_page,
        "total_pages": total_pages,
        "has_next":    page < total_pages,
        "has_prev":    page > 1,
    }
