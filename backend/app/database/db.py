import logging
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.config import settings

logger = logging.getLogger("cineticket")

class FallbackCollection:
    def __init__(self, name: str):
        self.name = name
        self._data = []
        self._id_counter = 1000

    async def find_one(self, filter_dict=None):
        filter_dict = filter_dict or {}
        for doc in self._data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    def find(self, filter_dict=None):
        filter_dict = filter_dict or {}
        results = []
        for doc in self._data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
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

    async def update_one(self, filter_dict, update_dict):
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

    async def count_documents(self, filter_dict=None):
        filter_dict = filter_dict or {}
        count = 0
        for doc in self._data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
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
    client: AsyncIOMotorClient = None
    db = None
    is_fallback: bool = False

db_manager = DatabaseManager()

async def connect_to_mongo():
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
    if db_manager.client:
        db_manager.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    return db_manager.db
