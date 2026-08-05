from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.db import get_database
from app.schemas.user_schema import UserProfile
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats")
async def get_admin_stats(current_admin: UserProfile = Depends(get_current_admin)):
    """
    Calculate KPI metrics, total revenue, tickets sold, and monthly genre revenue.
    """
    db = get_database()

    movies_col = db["movies"]
    bookings_col = db["bookings"]
    users_col = db["users"]
    showtimes_col = db["showtimes"]

    total_movies = await movies_col.count_documents({})
    total_users = await users_col.count_documents({})
    total_showtimes = await showtimes_col.count_documents({})

    all_bookings = await bookings_col.find().to_list(length=1000)

    confirmed_bookings = [b for b in all_bookings if b.get("status") == "CONFIRMED"]
    total_revenue = sum(b.get("total_amount", 0) for b in confirmed_bookings)
    total_tickets_sold = sum(len(b.get("seats", [])) for b in confirmed_bookings)

    # Monthly revenue breakdown simulation
    revenue_by_genre = {}
    all_movies_list = await movies_col.find().to_list(length=200)
    movie_genre_map = {str(m["_id"]): m.get("genre", ["General"])[0] for m in all_movies_list}

    for b in confirmed_bookings:
        m_id = b.get("movie_id")
        g = movie_genre_map.get(m_id, "Action")
        revenue_by_genre[g] = revenue_by_genre.get(g, 0) + b.get("total_amount", 0)

    recent_bookings = []
    for b in sorted(all_bookings, key=lambda x: x.get("booking_time", ""), reverse=True)[:10]:
        b_dict = dict(b)
        b_dict["id"] = str(b_dict["_id"])
        recent_bookings.append(b_dict)

    return {
        "total_revenue": round(total_revenue, 2),
        "total_tickets_sold": total_tickets_sold,
        "total_movies": total_movies,
        "total_users": total_users,
        "total_showtimes": total_showtimes,
        "revenue_by_genre": revenue_by_genre,
        "recent_bookings": recent_bookings
    }

@router.get("/bookings")
async def get_all_bookings(current_admin: UserProfile = Depends(get_current_admin)):
    db = get_database()
    bookings_col = db["bookings"]

    all_b = await bookings_col.find().to_list(length=500)
    res = []
    for b in all_b:
        b_dict = dict(b)
        b_dict["id"] = str(b_dict["_id"])
        res.append(b_dict)
    res.sort(key=lambda x: x.get("booking_time", ""), reverse=True)
    return res
