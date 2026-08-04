from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from app.database.db import get_database
from app.schemas.showtime_schema import ShowtimeCreate, ShowtimeResponse
from app.schemas.user_schema import UserProfile
from app.services.auth_service import get_current_admin
from app.services.seat_locking_service import seat_lock_service

router = APIRouter(prefix="/showtimes", tags=["Showtimes"])

@router.get("", response_model=List[ShowtimeResponse])
async def get_showtimes(
    movie_id: Optional[str] = None,
    show_date: Optional[str] = None,
    theater_name: Optional[str] = None
):
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

    cursor = showtimes_col.find(filter_dict)
    showtimes = await cursor.to_list(length=200)

    # If no showtimes exist for movie & date, generate showtimes on-the-fly
    if not showtimes and movie_id:
        movie = await movies_col.find_one({"_id": movie_id})
        if movie:
            from datetime import datetime
            target_date = show_date or datetime.now().strftime("%Y-%m-%d")
            theaters = [
                {"name": "CinePlex Grand IMAX", "screen": "IMAX 3D Laser", "reg": 16.50, "vip": 24.00},
                {"name": "Starlight Cinema 9", "screen": "VIP Dolby Atmos", "reg": 14.00, "vip": 20.00},
                {"name": "Downtown MoviePlex", "screen": "Standard 2D", "reg": 12.00, "vip": 16.00}
            ]
            times = ["10:30 AM", "02:15 PM", "06:00 PM", "09:30 PM"]

            for t_idx, th in enumerate(theaters):
                st_id = f"st_{movie_id}_{target_date}_{t_idx}"
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
                    "booked_seats": ["C5", "C6"] if t_idx == 0 else []
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

@router.get("/{showtime_id}", response_model=ShowtimeResponse)
async def get_showtime_details(showtime_id: str):
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

@router.post("", response_model=ShowtimeResponse, status_code=status.HTTP_201_CREATED)
async def create_showtime(
    showtime_data: ShowtimeCreate,
    current_admin: UserProfile = Depends(get_current_admin)
):
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
