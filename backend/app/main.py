from fastapi import FastAPI
from app.dependencies import setup_cors
from app.routers import auth, news, user

app = FastAPI()
setup_cors(app)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(user.router, prefix="/api/user", tags=["User"])
