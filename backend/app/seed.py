import asyncio
from datetime import datetime, timedelta
from app.database.db import get_database, connect_to_mongo
from app.utils.security import get_password_hash

async def seed_data():
    db = get_database()
    users_col = db["users"]
    movies_col = db["movies"]
    showtimes_col = db["showtimes"]
    reviews_col = db["reviews"]

    # 1. Seed Users
    admin_pw = get_password_hash("admin123")
    user_pw = get_password_hash("user123")

    existing_admin = await users_col.find_one({"email": "admin@cineticket.com"})
    if not existing_admin:
        await users_col.insert_one({
            "_id": "admin_user_01",
            "full_name": "Cinema Manager (Admin)",
            "email": "admin@cineticket.com",
            "password": admin_pw,
            "role": "admin",
            "created_at": datetime.utcnow().isoformat(),
            "favorites": []
        })

    existing_user = await users_col.find_one({"email": "user@cineticket.com"})
    if not existing_user:
        await users_col.insert_one({
            "_id": "standard_user_01",
            "full_name": "John Doe",
            "email": "user@cineticket.com",
            "password": user_pw,
            "role": "user",
            "created_at": datetime.utcnow().isoformat(),
            "favorites": []
        })

    # 2. Seed Movies if empty
    movie_count = await movies_col.count_documents()
    if movie_count == 0:
        movies_data = [
            {
                "_id": "m_dune2",
                "title": "Dune: Part Two",
                "synopsis": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                "genre": ["Sci-Fi", "Adventure", "Action"],
                "language": "English",
                "duration_mins": 166,
                "rating": 4.9,
                "reviews_count": 128,
                "release_date": "2026-03-01",
                "poster_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
                "banner_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
                "trailer_url": "https://www.youtube.com/embed/Way9Dexny3w",
                "status": "now_showing",
                "cast": ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
                "director": "Denis Villeneuve"
            },
            {
                "_id": "m_oppenheimer",
                "title": "Oppenheimer",
                "synopsis": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
                "genre": ["Drama", "History", "Biography"],
                "language": "English",
                "duration_mins": 180,
                "rating": 4.8,
                "reviews_count": 94,
                "release_date": "2026-02-15",
                "poster_url": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80",
                "banner_url": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80",
                "trailer_url": "https://www.youtube.com/embed/uYPbbksJxIg",
                "status": "now_showing",
                "cast": ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
                "director": "Christopher Nolan"
            },
            {
                "_id": "m_cyberpulse",
                "title": "CyberPulse: 2099",
                "synopsis": "In a neon-drenched dystopian metropolis, a rogue hacker uncovers a sinister artificial intelligence takeover conspiracy.",
                "genre": ["Sci-Fi", "Cyberpunk", "Thriller"],
                "language": "English",
                "duration_mins": 142,
                "rating": 4.7,
                "reviews_count": 65,
                "release_date": "2026-06-20",
                "poster_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
                "banner_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
                "trailer_url": "https://www.youtube.com/embed/Way9Dexny3w",
                "status": "now_showing",
                "cast": ["Keanu Reeves", "Ana de Armas", "Hiroyuki Sanada"],
                "director": "Lana Wachowski"
            },
            {
                "_id": "m_interstellar2",
                "title": "Starlight Horizons",
                "synopsis": "Humanity's first deep space expedition beyond the Andromeda galaxy discovers an ancient cosmic artifact.",
                "genre": ["Sci-Fi", "Adventure"],
                "language": "English",
                "duration_mins": 155,
                "rating": 4.6,
                "reviews_count": 42,
                "release_date": "2026-07-01",
                "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
                "banner_url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
                "trailer_url": "https://www.youtube.com/embed/zSWdZVtXT7E",
                "status": "now_showing",
                "cast": ["Matthew McConaughey", "Jessica Chastain", "Anne Hathaway"],
                "director": "Christopher Nolan"
            },
            {
                "_id": "m_avatar3",
                "title": "Avatar: Fire & Ash",
                "synopsis": "Jake Sully and Neytiri encounter a aggressive volcanic clan of Na'vi on the uncharted continents of Pandora.",
                "genre": ["Fantasy", "Action", "Adventure"],
                "language": "English",
                "duration_mins": 190,
                "rating": 4.9,
                "reviews_count": 150,
                "release_date": "2026-12-18",
                "poster_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
                "banner_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
                "trailer_url": "https://www.youtube.com/embed/d9MyW72ELq0",
                "status": "coming_soon",
                "cast": ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
                "director": "James Cameron"
            }
        ]

        for m in movies_data:
            await movies_col.insert_one(m)

        # 3. Seed Showtimes
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        day_after = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")

        theaters = [
            {"name": "CinePlex Grand IMAX", "screen": "IMAX 3D Laser", "reg": 16.50, "vip": 24.00},
            {"name": "Starlight Cinema 9", "screen": "VIP Dolby Atmos", "reg": 14.00, "vip": 20.00},
            {"name": "Downtown MoviePlex", "screen": "Standard 2D", "reg": 12.00, "vip": 16.00}
        ]

        times = ["10:30 AM", "02:15 PM", "06:00 PM", "09:30 PM"]

        st_id = 500
        for m in movies_data:
            if m["status"] == "coming_soon":
                continue
            for d in [today, tomorrow, day_after]:
                for t_idx, th in enumerate(theaters):
                    st_id += 1
                    time_slot = times[t_idx % len(times)]
                    # Pre-book a couple of seats for realistic look
                    pre_booked = ["C5", "C6", "D7"] if st_id % 3 == 0 else []
                    await showtimes_col.insert_one({
                        "_id": f"st_{st_id}",
                        "movie_id": m["_id"],
                        "movie_title": m["title"],
                        "theater_name": th["name"],
                        "screen_type": th["screen"],
                        "show_date": d,
                        "show_time": time_slot,
                        "regular_price": th["reg"],
                        "vip_price": th["vip"],
                        "booked_seats": pre_booked
                    })

        # 4. Sample Reviews
        sample_revs = [
            {"movie_id": "m_dune2", "user_name": "Sarah Connor", "rating": 5.0, "comment": "Absolute cinematic masterpiece! Visuals and audio score were out of this world.", "created_at": "2026-03-05 14:20"},
            {"movie_id": "m_dune2", "user_name": "Marcus Vance", "rating": 4.8, "comment": "Spectacular sequel. Timothée and Zendaya delivered incredible performances.", "created_at": "2026-03-06 18:45"},
            {"movie_id": "m_oppenheimer", "user_name": "David Bowie", "rating": 5.0, "comment": "Brilliant pacing and intense sound design. A historical drama masterpiece.", "created_at": "2026-02-18 20:10"}
        ]
        r_counter = 800
        for r in sample_revs:
            r_counter += 1
            r["_id"] = f"rev_{r_counter}"
            await reviews_col.insert_one(r)

    print("Data seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
