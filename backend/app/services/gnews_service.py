import requests
from fastapi import HTTPException
from app.config import GNEWS_API_KEYS

current_api_key_index = 0

def get_gnews_api_key():
    global current_api_key_index
    if not GNEWS_API_KEYS:
        raise HTTPException(status_code=500, detail="GNews API keys not configured.")
    key = GNEWS_API_KEYS[current_api_key_index]
    current_api_key_index = (current_api_key_index + 1) % len(GNEWS_API_KEYS)
    return key

def fetch_gnews(endpoint: str, params: dict):
    api_key = get_gnews_api_key()
    base_url = "https://gnews.io/api/v4"
    params["apikey"] = api_key
    try:
        response = requests.get(f"{base_url}/{endpoint}", params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"GNews API Error: {e}")
