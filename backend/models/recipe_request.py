from pydantic import BaseModel, Field
from typing import Optional


class RecipeRequest(BaseModel):
    ingredients: list[str] = Field(..., min_length=1)
    meal_type: Optional[str] = None
    servings: Optional[int] = Field(None, ge=1, le=20)
    dietary_restrictions: list[str] = []
