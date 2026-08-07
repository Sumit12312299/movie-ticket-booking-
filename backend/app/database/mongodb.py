import logging
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.settings import settings

logger = logging.getLogger(__name__)


class MongoDB:
    """MongoDB connection manager using Motor async driver."""

    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

    async def connect(self):
        """Create database connection."""
        logger.info("Connecting to MongoDB at %s...", settings.MONGODB_URL)
        # Fast timeout (3s) so startup doesn't hang if database is offline
        self.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=3000,
        )
        self.db = self.client[settings.DATABASE_NAME]
        # Schedule index creation in background without blocking server startup
        asyncio.create_task(self._create_indexes())
        logger.info("MongoDB client initialized for database: %s", settings.DATABASE_NAME)

    async def _create_indexes(self):
        """Create necessary indexes for performance."""
        try:
            await self.db["users"].create_index("email", unique=True)
            await self.db["movies"].create_index("title")
            await self.db["movies"].create_index("genre")
            await self.db["shows"].create_index([("movie_id", 1), ("show_time", 1)])
            await self.db["bookings"].create_index("user_id")
            logger.info("MongoDB indexes created successfully.")
        except Exception as e:
            logger.warning("MongoDB background index creation note: %s", e)

    async def close(self):
        """Close database connection."""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

    def get_db(self) -> AsyncIOMotorDatabase:
        """Return the database instance."""
        return self.db


mongodb = MongoDB()
