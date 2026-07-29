from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from datetime import datetime
from app.database.db import get_database
from app.schemas.movie_schema import MovieCreate, MovieUpdate, MovieResponse, ReviewCreate, ReviewResponse
from app.schemas.user_schema import UserProfile
from app.services.auth_service import get_current_user, get_current_admin

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.get("", response_model=dict)
async def list_movies(
    search: Optional[str] = None,
    genre: Optional[str] = None,
    status: Optional[str] = None,  # "now_showing", "coming_soon"
    sort_by: Optional[str] = "rating",  # "rating", "title", "release_date"
    order: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50)
):
    db = get_database()
    movies_col = db["movies"]
    
    query = {}
    if status:
        query["status"] = status
    if genre and genre.lower() != "all":
        query["genre"] = {"$in": [genre]}
        
    movies_cursor = movies_col.find()
    all_movies = await movies_cursor.to_list(length=1000)
    
    # Filter in python for max flexibility across fallback & motor
    filtered = []
    for m in all_movies:
        # Search match
        if search:
            s_lower = search.lower()
            m_title = m.get("title", "").lower()
            m_cast = " ".join(m.get("cast", [])).lower()
            if s_lower not in m_title and s_lower not in m_cast:
                continue
        # Status match
        if status and m.get("status") != status:
            continue
        # Genre match
        if genre and genre.lower() != "all":
            genres_lower = [g.lower() for g in m.get("genre", [])]
            if genre.lower() not in genres_lower:
                continue
        
        m_dict = dict(m)
        m_dict["id"] = str(m.get("_id"))
        filtered.append(m_dict)

    # Sorting
    reverse = (order.lower() == "desc")
    if sort_by == "rating":
        filtered.sort(key=lambda x: x.get("rating", 0), reverse=reverse)
    elif sort_by == "title":
        filtered.sort(key=lambda x: x.get("title", ""), reverse=reverse)
    elif sort_by == "release_date":
        filtered.sort(key=lambda x: x.get("release_date", ""), reverse=reverse)

    total = len(filtered)
    start = (page - 1) * limit
    paginated = filtered[start : start + limit]

    return {
        "items": paginated,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 1
    }

@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: str):
    db = get_database()
    movies_col = db["movies"]
    
    movie = await movies_col.find_one({"_id": movie_id})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    movie_dict = dict(movie)
    movie_dict["id"] = str(movie["_id"])
    return MovieResponse(**movie_dict)

@router.post("", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
async def create_movie(
    movie_data: MovieCreate,
    current_admin: UserProfile = Depends(get_current_admin)
):
    db = get_database()
    movies_col = db["movies"]
    
    new_movie = movie_data.model_dump()
    new_movie["reviews_count"] = 0
    
    res = await movies_col.insert_one(new_movie)
    new_movie["id"] = str(res.inserted_id)
    return MovieResponse(**new_movie)

@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: str,
    movie_update: MovieUpdate,
    current_admin: UserProfile = Depends(get_current_admin)
):
    db = get_database()
    movies_col = db["movies"]
    
    movie = await movies_col.find_one({"_id": movie_id})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    update_data = {k: v for k, v in movie_update.model_dump().items() if v is not None}
    if update_data:
        await movies_col.update_one({"_id": movie_id}, {"$set": update_data})
        
    updated_movie = await movies_col.find_one({"_id": movie_id})
    updated_dict = dict(updated_movie)
    updated_dict["id"] = str(updated_dict["_id"])
    return MovieResponse(**updated_dict)

@router.delete("/{movie_id}")
async def delete_movie(
    movie_id: str,
    current_admin: UserProfile = Depends(get_current_admin)
):
    db = get_database()
    movies_col = db["movies"]
    
    res = await movies_col.delete_one({"_id": movie_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    return {"message": "Movie deleted successfully"}

# Reviews
@router.get("/{movie_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews(movie_id: str):
    db = get_database()
    reviews_col = db["reviews"]
    cursor = reviews_col.find({"movie_id": movie_id})
    reviews = await cursor.to_list(length=100)
    res = []
    for r in reviews:
        r_dict = dict(r)
        r_dict["id"] = str(r_dict.get("_id"))
        res.append(ReviewResponse(**r_dict))
    return res

@router.post("/{movie_id}/reviews", response_model=ReviewResponse)
async def add_review(
    movie_id: str,
    review: ReviewCreate,
    current_user: UserProfile = Depends(get_current_user)
):
    db = get_database()
    movies_col = db["movies"]
    reviews_col = db["reviews"]
    
    movie = await movies_col.find_one({"_id": movie_id})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    rev_doc = {
        "movie_id": movie_id,
        "user_name": current_user.full_name,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    }
    
    inserted = await reviews_col.insert_one(rev_doc)
    rev_doc["id"] = str(inserted.inserted_id)
    
    # Recalculate average rating
    all_revs = await (reviews_col.find({"movie_id": movie_id})).to_list(length=100)
    avg_rating = round(sum(r["rating"] for r in all_revs) / len(all_revs), 1) if all_revs else review.rating
    await movies_col.update_one({"_id": movie_id}, {"$set": {"rating": avg_rating, "reviews_count": len(all_revs)}})

    return ReviewResponse(**rev_doc)
