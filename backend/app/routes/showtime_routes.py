"""
showtime_routes.py
------------------
FastAPI router for showtime screening slot management:
  - GET  /showtimes              — Query available showtimes with on-the-fly seeding
  - GET  /showtimes/{id}         — Fetch details for a single showtime
  - POST /showtimes              — Create a new showtime slot (admin only)
Seat lock status is merged into every response for real-time seat mapping.
"""
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from app.database.db import get_database
from app.schemas.showtime_schema import ShowtimeCreate, ShowtimeResponse
from app.schemas.user_schema import UserProfile
from app.services.auth_service import get_current_admin
from app.services.seat_locking_service import seat_lock_service

router = APIRouter(prefix="/showtimes", tags=["Showtimes"])

@router.get("", response_model=List[ShowtimeResponse], summary="Query showtimes with on-the-fly seed fallback")
async def get_showtimes(
    movie_id: Optional[str] = None,
    show_date: Optional[str] = None,
    theater_name: Optional[str] = None,
    city: Optional[str] = None
):
    """
    Retrieve available showtime screening slots filtered by movie, date, theater, or city.
    Generates realistic dynamic showtime schedules on-the-fly if no matching records exist.
    """
    db = get_database()
    showtimes_col = db["showtimes"]
    movies_col = db["movies"]

    filter_dict = {}
    if movie_id:
        filter_dict["movie_id"] = movie_id
    if show_date:
        filter_dict["show_date"] = show_date
    if theater_name:
        filter_dict["theater_name"] = theater_name
    if city:
        filter_dict["city"] = city

    cursor = showtimes_col.find(filter_dict)
    showtimes = await cursor.to_list(length=200)

    # If no showtimes exist for movie, date & city, generate showtimes on-the-fly
    if not showtimes and movie_id:
        movie = await movies_col.find_one({"_id": movie_id})
        if movie:
            from datetime import datetime
            target_date = show_date or datetime.now().strftime("%Y-%m-%d")
            target_city = city or "Mumbai"

            city_theaters = {
                "Mumbai": [
                    {"name": "CinePlex Grand IMAX", "screen": "IMAX 3D Laser", "reg": 350.00, "vip": 550.00},
                    {"name": "Starlight Cinema 9", "screen": "VIP Dolby Atmos", "reg": 280.00, "vip": 450.00},
                    {"name": "Downtown MoviePlex", "screen": "Standard 2D", "reg": 220.00, "vip": 350.00}
                ],
                "Delhi NCR": [
                    {"name": "PVR Director's Cut Delhi", "screen": "IMAX 3D Laser", "reg": 380.00, "vip": 600.00},
                    {"name": "Starlight Cinema Delhi", "screen": "VIP Dolby Atmos", "reg": 290.00, "vip": 460.00}
                ],
                "Bengaluru": [
                    {"name": "Cinepolis Forum Mall Bengaluru", "screen": "IMAX 3D Laser", "reg": 340.00, "vip": 520.00},
                    {"name": "Starlight Cinema Bengaluru", "screen": "VIP Dolby Atmos", "reg": 270.00, "vip": 440.00}
                ],
                "Phagwara": [
                    {"name": "Majestic Grand Phagwara", "screen": "VIP Dolby Atmos", "reg": 250.00, "vip": 400.00},
                    {"name": "PVR Curo Mall Phagwara", "screen": "Standard 2D", "reg": 200.00, "vip": 320.00}
                ]
            }

            theaters = city_theaters.get(target_city) or [
                {"name": f"CinePlex {target_city} Grand", "screen": "Standard 2D", "reg": 220.00, "vip": 350.00},
                {"name": f"Starlight Cinema {target_city}", "screen": "VIP Dolby Atmos", "reg": 280.00, "vip": 450.00}
            ]
            times = ["10:30 AM", "02:15 PM", "06:00 PM", "09:30 PM"]

            for t_idx, th in enumerate(theaters):
                st_id = f"st_{movie_id}_{target_date}_{target_city.lower().replace(' ', '_')}_{t_idx}"
                st_doc = {
                    "_id": st_id,
                    "movie_id": movie_id,
                    "movie_title": movie.get("title", "Unknown"),
                    "theater_name": th["name"],
                    "screen_type": th["screen"],
                    "show_date": target_date,
                    "show_time": times[t_idx % len(times)],
                    "regular_price": th["reg"],
                    "vip_price": th["vip"],
                    "booked_seats": ["C5", "C6"] if t_idx == 0 else [],
                    "city": target_city
                }
                await showtimes_col.update_one({"_id": st_id}, {"$setOnInsert": st_doc}, upsert=True)

            cursor = showtimes_col.find(filter_dict)
            showtimes = await cursor.to_list(length=200)

    result = []
    for st in showtimes:
        st_dict = dict(st)
        st_id = str(st["_id"])
        st_dict["id"] = st_id

        # Fetch movie title if not present
        if not st_dict.get("movie_title"):
            m = await movies_col.find_one({"_id": st_dict["movie_id"]})
            st_dict["movie_title"] = m.get("title", "Unknown Movie") if m else "Unknown Movie"

        # Get active locked seats for real-time seat mapping
        st_dict["locked_seats"] = seat_lock_service.get_locked_seats(st_id)
        result.append(ShowtimeResponse(**st_dict))

    return result

@router.get("/{showtime_id}", response_model=ShowtimeResponse, summary="Fetch single showtime details by ID")
async def get_showtime_details(showtime_id: str):
    """
    Return detailed information for a single showtime screening slot.
    Also merges currently active seat locks for real-time seat map rendering.
    """
    db = get_database()
    showtimes_col = db["showtimes"]
    movies_col = db["movies"]

    st = await showtimes_col.find_one({"_id": showtime_id})
    if not st:
        raise HTTPException(status_code=404, detail="Showtime not found")

    st_dict = dict(st)
    st_dict["id"] = str(st["_id"])
    if not st_dict.get("movie_title"):
        m = await movies_col.find_one({"_id": st_dict["movie_id"]})
        st_dict["movie_title"] = m.get("title", "") if m else ""

    st_dict["locked_seats"] = seat_lock_service.get_locked_seats(showtime_id)
    return ShowtimeResponse(**st_dict)

@router.post("", response_model=ShowtimeResponse, status_code=status.HTTP_201_CREATED, summary="Create a new showtime screening slot")
async def create_showtime(
    showtime_data: ShowtimeCreate,
    current_admin: UserProfile = Depends(get_current_admin)
):
    """
    Create a new showtime screening schedule for an existing movie.
    Validates target movie existence and initializes with empty booked and locked seat lists.
    Admin credentials required.
    """
    db = get_database()
    showtimes_col = db["showtimes"]
    movies_col = db["movies"]

    movie = await movies_col.find_one({"_id": showtime_data.movie_id})
    if not movie:
        raise HTTPException(status_code=404, detail="Target movie not found")

    new_st = showtime_data.model_dump()
    new_st["movie_title"] = movie.get("title", "")
    new_st["booked_seats"] = []

    res = await showtimes_col.insert_one(new_st)
    new_st["id"] = str(res.inserted_id)
    new_st["locked_seats"] = []

    return ShowtimeResponse(**new_st)
