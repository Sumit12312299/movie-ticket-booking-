from typing import List, Dict, Any

def paginate_list(items: List[Any], page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    page = max(1, page)
    per_page = max(1, min(100, per_page))
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page if total > 0 else 0
    }
