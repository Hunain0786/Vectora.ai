from motor.motor_asyncio import AsyncIOMotorClient
import config

class Database:
    client: AsyncIOMotorClient = None

    async def connect(self):
        if not config.MONGO_URI:
            print("MONGO_URI not found in environment variables")
            return
        
        try:
            self.client = AsyncIOMotorClient(config.MONGO_URI)
            # Verify connection
            await self.client.admin.command('ping')
            print("Connected to MongoDB")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            self.client = None

    def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")

    def get_db(self, db_name="vectora_db"):
        if self.client:
            return self.client[db_name]
        return None

db = Database()
