import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "product_db")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]
products_collection = db["products"]


async def get_database():
    return db
