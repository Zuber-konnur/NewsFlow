from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from app.config import SUPABASE_URL, SUPABASE_KEY, FRONTEND_URL

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
