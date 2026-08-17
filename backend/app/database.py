import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.config import settings

logger = logging.getLogger(__name__)

class Database:
    client: MongoClient = None
    db = None
    in_memory_store = {
        "aqi_predictions": [],
        "health_predictions": [],
        "prediction_history": [],
        "model_metrics": [],
        "system_logs": []
    }
    use_in_memory: bool = False

    def connect(self):
        try:
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=3000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.use_in_memory = False
            logger.info(f"Connected to MongoDB at {settings.MONGODB_URI}, DB: {settings.DATABASE_NAME}")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            logger.warning(f"MongoDB connection failed: {e}. Falling back to in-memory store.")
            self.use_in_memory = True

    def get_collection(self, name: str):
        if not self.use_in_memory and self.db is not None:
            return self.db[name]
        return None

    def insert_prediction(self, collection_name: str, document: dict):
        if not self.use_in_memory and self.db is not None:
            try:
                col = self.db[collection_name]
                col.insert_one(document)
                # also insert into prediction_history
                if collection_name != "prediction_history":
                    self.db["prediction_history"].insert_one(document)
                return True
            except Exception as e:
                logger.error(f"Error inserting into MongoDB: {e}")
        
        # Fallback in-memory insertion
        if collection_name in self.in_memory_store:
            self.in_memory_store[collection_name].append(document)
            if collection_name != "prediction_history":
                self.in_memory_store["prediction_history"].append(document)
        return True

    def get_history(self, collection_name: str, limit: int = 50, city: str = None):
        if not self.use_in_memory and self.db is not None:
            try:
                col = self.db[collection_name]
                query = {}
                if city:
                    query["location.city"] = {"$regex": f"^{city}$", "$options": "i"}
                cursor = col.find(query, {"_id": 0}).sort("prediction_time", -1).limit(limit)
                return list(cursor)
            except Exception as e:
                logger.error(f"Error reading from MongoDB: {e}")
        
        # Fallback memory lookup
        records = self.in_memory_store.get(collection_name, [])
        if city:
            records = [r for r in records if r.get("location", {}).get("city", "").lower() == city.lower()]
        return sorted(records, key=lambda x: x.get("prediction_time", ""), reverse=True)[:limit]

db = Database()
