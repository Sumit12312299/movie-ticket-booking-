"""
Seed script: Populates the database with sample movies, theatres, screens, shows, and an admin user.
Run: python -m app.utils.seed
"""
import asyncio
import sys
from datetime import datetime, timedelta, timezone

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings
from app.auth.password import hash_password
import string


async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    # Clear existing data
    for col in ["users", "movies", "theatres", "screens", "shows", "bookings"]:
        await db[col].drop()

    print("🗑️  Cleared existing collections.")

    # ---------- Admin User ----------
    admin = {
        "name": "Admin",
        "email": "admin@cinema.com",
        "password_hash": hash_password("admin123"),
        "role": "admin",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    await db["users"].insert_one(admin)
    print("👤 Admin user created: admin@cinema.com / admin123")

    # ---------- Customer User ----------
    customer = {
        "name": "John Doe",
        "email": "john@example.com",
        "password_hash": hash_password("john123"),
        "role": "customer",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    await db["users"].insert_one(customer)
    print("👤 Customer user created: john@example.com / john123")

    # ---------- Movies ----------
    movies_data = [
        {
            "title": "Inception",
            "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            "language": "English",
            "genre": ["Sci-Fi", "Action", "Thriller"],
            "duration_mins": 148,
            "poster_url": "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
            "release_date": "2024-07-16",
            "is_active": True,
        },
        {
            "title": "The Dark Knight",
            "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            "language": "English",
            "genre": ["Action", "Crime", "Drama"],
            "duration_mins": 152,
            "poster_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1EF0aD.jpg",
            "release_date": "2024-07-18",
            "is_active": True,
        },
        {
            "title": "Interstellar",
            "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            "language": "English",
            "genre": ["Sci-Fi", "Adventure", "Drama"],
            "duration_mins": 169,
            "poster_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            "release_date": "2024-11-07",
            "is_active": True,
        },
        {
            "title": "Oppenheimer",
            "description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
            "language": "English",
            "genre": ["Biography", "Drama", "History"],
            "duration_mins": 180,
            "poster_url": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            "release_date": "2024-07-21",
            "is_active": True,
        },
        {
            "title": "Dune: Part Two",
            "description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
            "language": "English",
            "genre": ["Sci-Fi", "Adventure"],
            "duration_mins": 166,
            "poster_url": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
            "release_date": "2024-03-01",
            "is_active": True,
        },
        {
            "title": "Pathaan",
            "description": "An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.",
            "language": "Hindi",
            "genre": ["Action", "Thriller"],
            "duration_mins": 146,
            "poster_url": "https://image.tmdb.org/t/p/w500/dKja0bWaR0VnbZgJJOidlPD9YLi.jpg",
            "release_date": "2024-01-25",
            "is_active": True,
        },
        {
            "title": "RRR",
            "description": "A fictitious story about two legendary revolutionaries and their journey away from home before they began fighting for their country in the 1920s.",
            "language": "Telugu",
            "genre": ["Action", "Drama"],
            "duration_mins": 187,
            "poster_url": "https://image.tmdb.org/t/p/w500/nEuFeZYZFmHBY8vCgmKEN22bPNU.jpg",
            "release_date": "2024-03-25",
            "is_active": True,
        },
        {
            "title": "Parasite",
            "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
            "language": "Korean",
            "genre": ["Comedy", "Drama", "Thriller"],
            "duration_mins": 132,
            "poster_url": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            "release_date": "2024-05-30",
            "is_active": True,
        },
    ]
    for m in movies_data:
        m["created_at"] = datetime.now(timezone.utc)

    result = await db["movies"].insert_many(movies_data)
    movie_ids = result.inserted_ids
    print(f"🎬 Inserted {len(movie_ids)} movies.")

    # ---------- Theatres ----------
    theatres_data = [
        {"name": "INOX Grand Cinemas", "location": "Mumbai, Maharashtra", "total_screens": 4, "created_at": datetime.now(timezone.utc)},
        {"name": "PVR Phoenix Mall", "location": "Bangalore, Karnataka", "total_screens": 6, "created_at": datetime.now(timezone.utc)},
        {"name": "Cinepolis Fun Republic", "location": "Delhi, NCR", "total_screens": 5, "created_at": datetime.now(timezone.utc)},
    ]
    result = await db["theatres"].insert_many(theatres_data)
    theatre_ids = result.inserted_ids
    print(f"🏢 Inserted {len(theatre_ids)} theatres.")

    # ---------- Screens ----------
    screens_data = []
    screen_map = {}  # theatre_idx -> list of screen_ids

    configs = [
        (0, [(1, 10, 12), (2, 8, 10), (3, 12, 14), (4, 8, 10)]),
        (1, [(1, 10, 14), (2, 10, 12), (3, 8, 10), (4, 12, 16), (5, 8, 10), (6, 10, 12)]),
        (2, [(1, 10, 12), (2, 8, 14), (3, 10, 10), (4, 8, 12), (5, 12, 14)]),
    ]

    for t_idx, screen_list in configs:
        screen_map[t_idx] = []
        for screen_num, rows, seats in screen_list:
            screen = {
                "theatre_id": str(theatre_ids[t_idx]),
                "screen_number": screen_num,
                "total_rows": rows,
                "seats_per_row": seats,
                "seat_capacity": rows * seats,
            }
            screens_data.append(screen)

    result = await db["screens"].insert_many(screens_data)
    screen_ids = result.inserted_ids
    print(f"🖥️  Inserted {len(screen_ids)} screens.")

    # ---------- Shows ----------
    shows_data = []
    now = datetime.now(timezone.utc)
    screen_idx = 0

    for t_idx, screen_list in configs:
        for s_offset, (screen_num, rows, seats) in enumerate(screen_list):
            sid = screen_ids[screen_idx]
            screen_idx += 1
            # Assign 1-2 movies with multiple show times
            for day in range(3):
                for hour in [10, 14, 18, 21]:
                    movie_idx = (t_idx + s_offset + day) % len(movie_ids)
                    show_time = now + timedelta(days=day, hours=hour - now.hour)

                    # Generate seat layout
                    seat_layout = []
                    for r in range(rows):
                        row_letter = string.ascii_uppercase[r % 26]
                        for s in range(1, seats + 1):
                            seat_layout.append({"row": row_letter, "number": s, "status": "available"})

                    total = rows * seats
                    show = {
                        "movie_id": str(movie_ids[movie_idx]),
                        "theatre_id": str(theatre_ids[t_idx]),
                        "screen_id": str(sid),
                        "show_time": show_time,
                        "price": 250.0 if hour < 14 else 350.0 if hour < 18 else 450.0,
                        "seat_layout": seat_layout,
                        "total_seats": total,
                        "available_seats": total,
                        "created_at": now,
                    }
                    shows_data.append(show)

    result = await db["shows"].insert_many(shows_data)
    print(f"🎭 Inserted {len(result.inserted_ids)} shows.")

    # Create indexes
    await db["users"].create_index("email", unique=True)
    await db["movies"].create_index("title")
    await db["shows"].create_index([("movie_id", 1), ("show_time", 1)])
    await db["bookings"].create_index("user_id")

    print("\n✅ Database seeded successfully!")
    print("   Admin login:    admin@cinema.com / admin123")
    print("   Customer login: john@example.com / john123")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
