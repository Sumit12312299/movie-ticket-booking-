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
    show_date: Optional[str] = None
):
    db = get_database()
    showtimes_col = db["showtimes"]
    movies_col = db["movies"]

    filter_dict = {}
    if movie_id:
        filter_dict["movie_id"] = movie_id
    if show_date:
        filter_dict["show_date"] = show_date

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
