import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.recipe import router as recipe_router

app = FastAPI(title="AI Recipe Generator")

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(recipe_router, prefix="/api")
