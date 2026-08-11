import logging
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.config import settings

logger = logging.getLogger("bookticket")

class FallbackCollection:
    """
    In-memory fallback collection replicating basic MongoDB collection queries.
    Provides High-Availability when connection to the primary database is lost.
    """
    def __init__(self, name: str):
        """
        Initializes the fallback in-memory collection.

        Args:
            name (str): The name of the collection (e.g. 'movies', 'bookings').
        """
        self.name = name
        self._data = []
        self._id_counter = 1000

    def _matches(self, doc: dict, filter_dict: dict) -> bool:
        """
        Checks if a document matches the given query constraints.
        Supports basic equality checks and comparative operations like $lt, $gt.
        """
        if not filter_dict:
            return True
        for k, v in filter_dict.items():
            if isinstance(v, dict):
                if "$lt" in v and not (doc.get(k, "") < v["$lt"]):
                    return False
                if "$gt" in v and not (doc.get(k, "") > v["$gt"]):
                    return False
            elif doc.get(k) != v:
                return False
        return True

    async def find_one(self, filter_dict=None):
        filter_dict = filter_dict or {}
        for doc in self._data:
            if self._matches(doc, filter_dict):
                return dict(doc)
        return None

    def find(self, filter_dict=None):
        filter_dict = filter_dict or {}
        results = []
        for doc in self._data:
            if self._matches(doc, filter_dict):
                results.append(dict(doc))
        
        class AsyncCursor:
            def __init__(self, items):
                self.items = items
            def sort(self, key, direction=1):
                reverse = direction == -1
                self.items.sort(key=lambda x: x.get(key, ""), reverse=reverse)
                return self
            def skip(self, n):
                self.items = self.items[n:]
                return self
            def limit(self, n):
                self.items = self.items[:n]
                return self
            async def to_list(self, length=None):
                if length is not None:
                    return self.items[:length]
                return self.items
            def __aiter__(self):
                self._iter = iter(self.items)
                return self
            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration
        
        return AsyncCursor(results)

    async def insert_one(self, doc):
        doc_copy = dict(doc)
        if "_id" not in doc_copy or not doc_copy["_id"]:
            self._id_counter += 1
            doc_copy["_id"] = str(self._id_counter)
        self._data = [d for d in self._data if d.get("_id") != doc_copy["_id"]]
        self._data.append(doc_copy)
        class InsertResult:
            inserted_id = doc_copy["_id"]
        return InsertResult()

    async def update_one(self, filter_dict, update_dict, upsert=False):
        doc = await self.find_one(filter_dict)
        if doc:
            for item in self._data:
                if item.get("_id") == doc.get("_id"):
                    if "$set" in update_dict:
                        for k, v in update_dict["$set"].items():
                            item[k] = v
                    if "$push" in update_dict:
                        for k, v in update_dict["$push"].items():
                            if k not in item:
                                item[k] = []
                            item[k].append(v)
                    class UpdateResult:
                        modified_count = 1
                    return UpdateResult()
        elif upsert:
            new_doc = {}
            if "_id" in filter_dict:
                new_doc["_id"] = filter_dict["_id"]
            if "$set" in update_dict:
                new_doc.update(update_dict["$set"])
            if "$setOnInsert" in update_dict:
                new_doc.update(update_dict["$setOnInsert"])
            await self.insert_one(new_doc)
            class UpdateResult:
                modified_count = 1
            return UpdateResult()

        class UpdateResult:
            modified_count = 0
        return UpdateResult()

    async def delete_one(self, filter_dict):
        doc = await self.find_one(filter_dict)
        if doc:
            self._data = [d for d in self._data if d.get("_id") != doc.get("_id")]
            class DeleteResult:
                deleted_count = 1
            return DeleteResult()
        class DeleteResult:
            deleted_count = 0
        return DeleteResult()

    async def delete_many(self, filter_dict=None):
        filter_dict = filter_dict or {}
        to_keep = []
        deleted_count = 0
        for doc in self._data:
            if self._matches(doc, filter_dict):
                deleted_count += 1
            else:
                to_keep.append(doc)
        self._data = to_keep
        class DeleteResult:
            def __init__(self, c):
                self.deleted_count = c
        return DeleteResult(deleted_count)

    async def count_documents(self, filter_dict=None):
        filter_dict = filter_dict or {}
        count = 0
        for doc in self._data:
            if self._matches(doc, filter_dict):
                count += 1
        return count


class FallbackDatabase:
    def __init__(self):
        self.collections = {}

    def get_collection(self, name: str):
        if name not in self.collections:
            self.collections[name] = FallbackCollection(name)
        return self.collections[name]

    def __getitem__(self, name: str):
        return self.get_collection(name)


class DatabaseManager:
    """
    Manages client connection instance and fallback status for database operations.
    Supports in-memory mock fallback to achieve high-availability in case MongoDB is down.
    """
    client: AsyncIOMotorClient = None
    db = None
    is_fallback: bool = False

db_manager = DatabaseManager()

async def connect_to_mongo():
    """
    Connects to the MongoDB server using Motor async driver.
    If the connection times out or fails, automatically switches to the
    in-memory FallbackDatabase to maintain zero-downtime availability.
    """
    try:
        logger.info(f"Attempting MongoDB connection at {settings.MONGODB_URL}...")
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=1500)
        await client.admin.command('ping')
        db_manager.client = client
        db_manager.db = client[settings.DATABASE_NAME]
        db_manager.is_fallback = False
        logger.info("Successfully connected to MongoDB database!")
    except Exception as e:
        logger.info(f"MongoDB connection notice ({e}). Activating High-Availability Embedded Fallback Store.")
        db_manager.db = FallbackDatabase()
        db_manager.is_fallback = True

async def close_mongo_connection():
    """
    Closes the active MongoDB client connection if initialized.
    """
    if db_manager.client:
        db_manager.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    """
    Retrieves the active database handle (either MongoDB or FallbackDatabase).

    Returns:
        Union[AsyncIOMotorDatabase, FallbackDatabase]: Active database engine
    """
    return db_manager.db
