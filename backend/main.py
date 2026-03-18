from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.recipe import router as recipe_router

app = FastAPI(title="AI Recipe Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(recipe_router, prefix="/api")
