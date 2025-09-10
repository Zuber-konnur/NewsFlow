import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")

GNEWS_API_KEYS = [
    os.getenv(f"GNEWS_API_KEY_{i}") for i in range(1, 6) if os.getenv(f"GNEWS_API_KEY_{i}")
]
