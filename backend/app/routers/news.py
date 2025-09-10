from fastapi import APIRouter
from app.services.gnews_service import fetch_gnews

router = APIRouter()

@router.get("/top-headlines")
def get_top_headlines(page: int = 1, lang: str = 'en'):
    params = {"lang": lang, "max": 9, "page": page}
    return fetch_gnews("top-headlines", params)

@router.get("/category/{category_name}")
def get_news_by_category(category_name: str, page: int = 1, lang: str = 'en'):
    params = {"topic": category_name.lower(), "lang": lang, "max": 9, "page": page}
    return fetch_gnews("top-headlines", params)

@router.get("/search")
def search_news(q: str, page: int = 1, lang: str = 'en'):
    if not q:
        raise HTTPException(status_code=400, detail="'q' is required.")
    params = {"q": q, "lang": lang, "max": 9, "page": page, "sortby": "publishedAt"}
    return fetch_gnews("search", params)
