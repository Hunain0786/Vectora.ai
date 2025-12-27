import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")
MONGO_URI = os.getenv("MONGO_URI")
CSV_PATH = "C2.csv"
