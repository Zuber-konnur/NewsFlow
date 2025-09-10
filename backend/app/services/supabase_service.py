from fastapi import HTTPException, Header
from typing import Optional
from app.dependencies import supabase

def get_user_from_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1] if " " in authorization else authorization
    try:
        user = supabase.auth.get_user(token)
        return user.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
