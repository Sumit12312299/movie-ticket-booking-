import os
import sys
import asyncio

# Ensure backend root is in PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from datetime import datetime, timedelta
from app.database.db import get_database, connect_to_mongo
from app.utils.security import get_password_hash

async def seed_data():
    await connect_to_mongo()
    db = get_database()
    users_col = db["users"]
    movies_col = db["movies"]
    showtimes_col = db["showtimes"]
    reviews_col = db["reviews"]

    # 1. Seed Users
    admin_pw = get_password_hash("admin123")
    user_pw = get_password_hash("user123")

    existing_admin = await users_col.find_one({"email": "admin@bookticket.com"})
    if not existing_admin:
        await users_col.delete_many({"_id": "admin_user_01"})
        await users_col.insert_one({
            "_id": "admin_user_01",
            "full_name": "Cinema Manager (Admin)",
            "email": "admin@bookticket.com",
            "password": admin_pw,
            "role": "admin",
            "created_at": datetime.utcnow().isoformat(),
            "favorites": []
        })

    existing_user = await users_col.find_one({"email": "user@bookticket.com"})
    if not existing_user:
        await users_col.delete_many({"_id": "standard_user_01"})
        await users_col.insert_one({
            "_id": "standard_user_01",
            "full_name": "John Doe",
            "email": "user@bookticket.com",
            "password": user_pw,
            "role": "user",
            "created_at": datetime.utcnow().isoformat(),
            "favorites": []
        })

    # Clear old list and seed full catalog
    await movies_col.delete_one({"_id": "dummy"}) # trigger fallback init if needed
    movie_count = await movies_col.count_documents()
    
    # We insert/update blockbuster movies catalog (including July & August 2026 releases)
    movies_data = [
        {
            "_id": "m_spiderman4",
            "title": "Spider-Man: Brand New Day",
            "synopsis": "Peter Parker attempts to lead a normal life in New York, but new threat arises as physiological changes to his powers begin to manifest, forcing him to team up with unexpected allies.",
            "genre": ["Action", "Sci-Fi", "Fantasy", "Adventure"],
            "language": "English",
            "duration_mins": 145,
            "rating": 4.9,
            "reviews_count": 312,
            "release_date": "2026-07-31",
            "poster_url": "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://youtu.be/62bIsvRcPv0?si=pLuB2j-pu_u5Gm85",
            "status": "now_showing",
            "cast": ["Tom Holland", "Zendaya", "Sadie Sink", "Jacob Batalon"],
            "director": "Destin Daniel Cretton"
        },
        {
            "_id": "m_deadpool3",
            "title": "Deadpool & Wolverine",
            "synopsis": "Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool to defeat a common enemy.",
            "genre": ["Action", "Sci-Fi", "Comedy"],
            "language": "English",
            "duration_mins": 128,
            "rating": 4.8,
            "reviews_count": 210,
            "release_date": "2026-07-26",
            "poster_url": "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/73_1biulk6s",
            "status": "now_showing",
            "cast": ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
            "director": "Shawn Levy"
        },
        {
            "_id": "m_superman",
            "title": "Superman: Legacy 4K IMAX",
            "synopsis": "Superman reconciles his Kryptonian heritage with his human upbringing as Clark Kent in Smallville.",
            "genre": ["Sci-Fi", "Action", "Fantasy"],
            "language": "English",
            "duration_mins": 155,
            "rating": 4.9,
            "reviews_count": 178,
            "release_date": "2026-07-11",
            "poster_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/Way9Dexny3w",
            "status": "now_showing",
            "cast": ["David Corenswet", "Rachel Brosnahan", "Nicholas Hoult"],
            "director": "James Gunn"
        },
        {
            "_id": "m_venom3",
            "title": "Venom: The Last Dance",
            "synopsis": "Eddie and Venom are on the run. Hunted by both of their worlds, the duo is forced into a devastating decision.",
            "genre": ["Sci-Fi", "Action", "Adventure"],
            "language": "English",
            "duration_mins": 140,
            "rating": 4.7,
            "reviews_count": 135,
            "release_date": "2026-07-18",
            "poster_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/Way9Dexny3w",
            "status": "now_showing",
            "cast": ["Tom Hardy", "Chiwetel Ejiofor", "Juno Temple"],
            "director": "Kelly Marcel"
        },
        {
            "_id": "m_despicable4",
            "title": "Despicable Me 4",
            "synopsis": "Gru, Lucy, and their girls welcome a new member to the family, Gru Jr., who is intent on tormenting his dad. As a new nemesis escapes prison, the family is forced to go on the run under witness protection.",
            "genre": ["Animation", "Comedy", "Family"],
            "language": "English",
            "duration_mins": 95,
            "rating": 4.6,
            "reviews_count": 192,
            "release_date": "2026-07-03",
            "poster_url": "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/qQuxc61t2hM",
            "status": "now_showing",
            "cast": ["Steve Carell", "Kristen Wiig", "Joey King", "Will Ferrell"],
            "director": "Chris Renaud"
        },
        {
            "_id": "m_twisters",
            "title": "Twisters: Storm Chase",
            "synopsis": "An epic disaster thriller that brings a pair of opposing storm chasers together as they risk their lives to test an experimental weather alert system amidst multiple tornado outbreaks.",
            "genre": ["Action", "Adventure", "Thriller"],
            "language": "English",
            "duration_mins": 122,
            "rating": 4.7,
            "reviews_count": 156,
            "release_date": "2026-07-19",
            "poster_url": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/J7G0y5e5_0Q",
            "status": "now_showing",
            "cast": ["Daisy Edgar-Jones", "Glen Powell", "Anthony Ramos"],
            "director": "Lee Isaac Chung"
        },
        {
            "_id": "m_trap",
            "title": "Trap: Pop concert",
            "synopsis": "A father and his teenage daughter attend a pop star's concert, only to realize that the entire event is a massive police trap designed to catch a notorious serial killer trapped inside.",
            "genre": ["Thriller", "Mystery", "Horror"],
            "language": "English",
            "duration_mins": 105,
            "rating": 4.5,
            "reviews_count": 89,
            "release_date": "2026-07-28",
            "poster_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/hYi9-Vp16gM",
            "status": "now_showing",
            "cast": ["Josh Hartnett", "Ariel Donoghue", "Saleka Shyamalan"],
            "director": "M. Night Shyamalan"
        },
        {
            "_id": "m_insideout2",
            "title": "Inside Out 2",
            "synopsis": "Joy, Sadness, Anger, Fear and Disgust have been running a successful operation by all accounts. However, when Riley turns 13, a group of new Emotions like Anxiety, Envy, and Embarrassment arrive.",
            "genre": ["Animation", "Comedy", "Family"],
            "language": "English",
            "duration_mins": 96,
            "rating": 4.8,
            "reviews_count": 260,
            "release_date": "2026-07-01",
            "poster_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/LEjhY15eCx0",
            "status": "now_showing",
            "cast": ["Amy Poehler", "Maya Hawke", "Phyllis Smith", "Lewis Black"],
            "director": "Kelsey Mann"
        },
        {
            "_id": "m_quietplace_dayone",
            "title": "A Quiet Place: Day One",
            "synopsis": "Experience the day the world went silent. A young woman named Sam finds herself trapped in New York City during the early stages of an invasion by alien creatures with ultra-sensitive hearing.",
            "genre": ["Sci-Fi", "Horror", "Thriller"],
            "language": "English",
            "duration_mins": 100,
            "rating": 4.7,
            "reviews_count": 115,
            "release_date": "2026-07-08",
            "poster_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/YPY7J-flzE8",
            "status": "now_showing",
            "cast": ["Lupita Nyong'o", "Joseph Quinn", "Alex Wolff"],
            "director": "Michael Sarnoski"
        },
        {
            "_id": "m_flymetothemoon",
            "title": "Fly Me to the Moon",
            "synopsis": "A marketing maven is brought in to fix NASA's public image during the 1960s Space Race, leading to havoc when she is tasked with staging a fake moon landing as a back-up plan.",
            "genre": ["Comedy", "Drama", "Romance"],
            "language": "English",
            "duration_mins": 132,
            "rating": 4.5,
            "reviews_count": 84,
            "release_date": "2026-07-15",
            "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/I536gK6u7kM",
            "status": "now_showing",
            "cast": ["Scarlett Johansson", "Channing Tatum", "Woody Harrelson"],
            "director": "Greg Berlanti"
        },
        {
            "_id": "m_maxxxine",
            "title": "MaXXXine",
            "synopsis": "In 1980s Hollywood, adult film star and aspiring actress Maxine Minx finally gets her big break. But as a mysterious killer stalks the starlets of Hollywood, a trail of blood threatens to reveal her sinister past.",
            "genre": ["Horror", "Mystery", "Thriller"],
            "language": "English",
            "duration_mins": 104,
            "rating": 4.4,
            "reviews_count": 73,
            "release_date": "2026-07-05",
            "poster_url": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/K9D4e_r-bQA",
            "status": "now_showing",
            "cast": ["Mia Goth", "Elizabeth Debicki", "Moses Sumney", "Michelle Monaghan"],
            "director": "Ti West"
        },
        {
            "_id": "m_alien_romulus",
            "title": "Alien: Romulus",
            "synopsis": "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
            "genre": ["Sci-Fi", "Horror", "Thriller"],
            "language": "English",
            "duration_mins": 119,
            "rating": 4.8,
            "reviews_count": 94,
            "release_date": "2026-08-16",
            "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/zSWdZVtXT7E",
            "status": "coming_soon",
            "cast": ["Cailee Spaeny", "David Jonsson", "Archie Renaux"],
            "director": "Fede Alvarez"
        },
        {
            "_id": "m_f1_apex",
            "title": "F1: Apex Championship",
            "synopsis": "A Formula One driver comes out of retirement to mentor and team up with a promising young driver on the APXGP team.",
            "genre": ["Action", "Drama", "Sport"],
            "language": "English",
            "duration_mins": 148,
            "rating": 4.9,
            "reviews_count": 160,
            "release_date": "2026-08-28",
            "poster_url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/Way9Dexny3w",
            "status": "coming_soon",
            "cast": ["Brad Pitt", "Damson Idris", "Javier Bardem", "Kerry Condon"],
            "director": "Joseph Kosinski"
        },
        {
            "_id": "m_dune2",
            "title": "Dune: Part Two",
            "synopsis": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
            "genre": ["Sci-Fi", "Adventure", "Action"],
            "language": "English",
            "duration_mins": 166,
            "rating": 4.9,
            "reviews_count": 142,
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
            "genre": ["Drama", "Biography"],
            "language": "English",
            "duration_mins": 180,
            "rating": 4.9,
            "reviews_count": 185,
            "release_date": "2026-02-15",
            "poster_url": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/uYPbbksJxIg",
            "status": "now_showing",
            "cast": ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
            "director": "Christopher Nolan"
        },
        {
            "_id": "m_interstellar",
            "title": "Interstellar: Remastered",
            "synopsis": "When Earth becomes uninhabitable, a team of ex-NASA pilots travel through a wormhole near Saturn in search of a new home.",
            "genre": ["Sci-Fi", "Adventure", "Drama"],
            "language": "English",
            "duration_mins": 169,
            "rating": 5.0,
            "reviews_count": 340,
            "release_date": "2026-05-10",
            "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            "banner_url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
            "trailer_url": "https://www.youtube.com/embed/zSWdZVtXT7E",
            "status": "now_showing",
            "cast": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
            "director": "Christopher Nolan"
        }
    ]

    for m in movies_data:
        await movies_col.update_one({"_id": m["_id"]}, {"$set": m}, upsert=True)

    # 3. Seed Showtimes
    today = datetime.now().strftime("%Y-%m-%d")
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    day_after = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")

    theaters = [
        {"name": "CinePlex Grand IMAX", "screen": "IMAX 3D Laser", "reg": 350.00, "vip": 550.00},
        {"name": "Starlight Cinema 9", "screen": "VIP Dolby Atmos", "reg": 280.00, "vip": 450.00},
        {"name": "Downtown MoviePlex", "screen": "Standard 2D", "reg": 220.00, "vip": 350.00}
    ]

    times = ["10:30 AM", "02:15 PM", "06:00 PM", "09:30 PM"]

    # Purge past showtimes
    await showtimes_col.delete_many({"show_date": {"$lt": today}})

    st_counter = 500
    for m in movies_data:
        for d in [today, tomorrow, day_after]:
            existing_for_date = await showtimes_col.find_one({"movie_id": m["_id"], "show_date": d})
            if not existing_for_date:
                for t_idx, th in enumerate(theaters):
                    st_counter += 1
                    time_slot = times[t_idx % len(times)]
                    pre_booked = ["C5", "C6", "D7"] if st_counter % 3 == 0 else []
                    await showtimes_col.insert_one({
                        "_id": f"st_{m['_id']}_{d}_{t_idx}",
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
        {"movie_id": "m_deadpool3", "user_name": "Marcus Vance", "rating": 4.8, "comment": "Hilarious action and unbelievable chemistry between Reynolds and Jackman!", "created_at": "2026-07-27 18:45"},
        {"movie_id": "m_oppenheimer", "user_name": "David Bowie", "rating": 5.0, "comment": "Brilliant pacing and intense sound design. A historical drama masterpiece.", "created_at": "2026-02-18 20:10"},
        {"movie_id": "m_despicable4", "user_name": "Emily Watson", "rating": 4.5, "comment": "Super fun movie for the family, kids absolutely loved the Mega Minions!", "created_at": "2026-07-05 15:30"},
        {"movie_id": "m_twisters", "user_name": "Alan Grant", "rating": 4.6, "comment": "The wind and sound effects were crazy! Glen Powell is outstanding in this storm adventure.", "created_at": "2026-07-21 19:20"},
        {"movie_id": "m_insideout2", "user_name": "Riley Fan", "rating": 5.0, "comment": "Anxiety is so relatable! Pixar did it again with a beautiful, emotional story.", "created_at": "2026-07-03 10:15"},
        {"movie_id": "m_quietplace_dayone", "user_name": "Lupita Admirer", "rating": 4.7, "comment": "Incredible tension from start to finish. Lupita Nyong'o is stellar.", "created_at": "2026-07-10 14:30"},
        {"movie_id": "m_flymetothemoon", "user_name": "Space Nerd", "rating": 4.5, "comment": "A fun, stylized romantic comedy with a great chemistry between Scarlett and Channing.", "created_at": "2026-07-16 20:05"},
        {"movie_id": "m_maxxxine", "user_name": "Horror Buff", "rating": 4.4, "comment": "Mia Goth delivers another stunning performance. Perfect 80s aesthetic.", "created_at": "2026-07-06 22:15"},
        {"movie_id": "m_spiderman4", "user_name": "Peter Fan", "rating": 5.0, "comment": "Tom Holland's best performance yet! Destin Daniel Cretton has delivered a legendary Spider-Man film.", "created_at": "2026-07-31 09:00"},
        {"movie_id": "m_spiderman4", "user_name": "MJ Rocks", "rating": 4.8, "comment": "Unbelievable action scenes, Sadie Sink is a fantastic addition to the cast!", "created_at": "2026-07-31 09:30"}
    ]
    r_counter = 800
    for r in sample_revs:
        r_counter += 1
        r_id = f"rev_{r_counter}"
        r["_id"] = r_id
        existing_rev = await reviews_col.find_one({"_id": r_id})
        if not existing_rev:
            await reviews_col.insert_one(r)

    print("Data seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
