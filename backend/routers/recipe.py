import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from models.recipe_request import RecipeRequest
from services.anthropic_service import stream_recipe

router = APIRouter()


async def event_generator(request: RecipeRequest):
    try:
        for chunk in stream_recipe(request):
            # Use proper multi-line SSE: prefix each line with "data: "
            lines = chunk.split("\n")
            event = "".join(f"data: {line}\n" for line in lines) + "\n"
            yield event
        yield "data: [DONE]\n\n"
    except RuntimeError as e:
        yield f"event: error\ndata: {json.dumps(str(e))}\n\n"


@router.post("/generate-recipe")
async def generate_recipe(request: RecipeRequest):
    return StreamingResponse(
        event_generator(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
