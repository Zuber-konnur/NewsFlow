from fastapi import APIRouter
from app.models import UserAuth
from app.dependencies import supabase
from fastapi import HTTPException

router = APIRouter()

@router.post("/signup")
def signup(user_credentials: UserAuth):
    signup_data = {
        "email": user_credentials.email,
        "password": user_credentials.password,
    }
    if user_credentials.name:
        signup_data["options"] = {"data": {"name": user_credentials.name}}
    user = supabase.auth.sign_up(signup_data)
    return {"user": user.user, "session": user.session}

@router.post("/login")
def login(user_credentials: UserAuth):
    try:
        user = supabase.auth.sign_in_with_password({
            "email": user_credentials.email,
            "password": user_credentials.password,
        })
        return {"user": user.user, "session": user.session}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid login credentials.")
