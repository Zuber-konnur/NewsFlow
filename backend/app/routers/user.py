from fastapi import APIRouter, Header
from typing import Optional
from app.models import NewsArticle
from app.services.supabase_service import get_user_from_token
from app.dependencies import supabase

router = APIRouter()

@router.get("/saved")
def get_saved_news(authorization: Optional[str] = Header(None)):
    user_id = get_user_from_token(authorization)
    data = supabase.table('savednews').select("*").eq('user_id', user_id).execute()
    return data.data

@router.get("/history")
def get_user_history(authorization: Optional[str] = Header(None)):
    user_id = get_user_from_token(authorization)
    data = supabase.table('history').select("*").eq('user_id', user_id).execute()
    return data.data

@router.post("/saved")
def save_article(article: NewsArticle, authorization: Optional[str] = Header(None)):
    user_id = get_user_from_token(authorization)
    record = article.dict()
    record['user_id'] = user_id
    supabase.table('savednews').insert(record).execute()
    return {"message": "Article saved"}

@router.post("/history")
def add_to_history(article: NewsArticle, authorization: Optional[str] = Header(None)):
    user_id = get_user_from_token(authorization)
    record = article.dict()
    record['user_id'] = user_id
    supabase.table('history').insert(record).execute()
    return {"message": "Article added to history"}
