from pydantic import BaseModel
from typing import Optional

class UserAuth(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class NewsArticle(BaseModel):
    title: str
    description: str
    content: Optional[str] = None
    url: str
    image: Optional[str] = None
    publishedAt: Optional[str] = None
