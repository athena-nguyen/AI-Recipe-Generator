import os
from typing import Generator

import anthropic
from dotenv import load_dotenv

from models.recipe_request import RecipeRequest

load_dotenv()

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def build_prompt(request: RecipeRequest) -> str:
    ingredients_str = ", ".join(request.ingredients)
    meal_str = request.meal_type if request.meal_type and request.meal_type != "Any" else "any meal type"
    servings_str = str(request.servings) if request.servings else "a reasonable number of"

    restrictions = ""
    if request.dietary_restrictions:
        restrictions = f"\n- Dietary/allergy requirements: {', '.join(request.dietary_restrictions)}"

    return f"""You are an expert chef and cookbook author. Create a detailed, practical recipe based on these inputs:

- Available ingredients: {ingredients_str}
- Meal type: {meal_str}
- Servings: {servings_str} servings{restrictions}

Format the recipe EXACTLY as a professional cookbook entry using this Markdown structure:

# [Recipe Title]

> [One-sentence enticing description of the dish]

## At a Glance
| | |
|---|---|
| **Prep Time** | X minutes |
| **Cook Time** | X minutes |
| **Total Time** | X minutes |
| **Servings** | X |
| **Difficulty** | Easy / Medium / Hard |

## Ingredients
- [quantity] [ingredient]
- [quantity] [ingredient]

## Instructions
1. [Clear, actionable step]
2. [Clear, actionable step]

## Chef's Tips
- [Helpful tip about technique, substitutions, or storage]
- [Another tip]

## Nutrition (per serving, approximate)
| Nutrient | Amount |
|---|---|
| Calories | ~XXX kcal |
| Protein | Xg |
| Carbohydrates | Xg |
| Fat | Xg |

Important rules:
- Use ONLY the provided ingredients (you may assume pantry staples like salt, pepper, oil, butter, and water are available)
- If the ingredients don't logically combine into the requested meal type, create the closest reasonable recipe
- Be specific with quantities and temperatures (use °F)
- Write instructions as if teaching a home cook — clear, concise, and encouraging
- Do NOT add any text before the recipe title or after the nutrition section"""


def stream_recipe(request: RecipeRequest) -> Generator[str, None, None]:
    prompt = build_prompt(request)
    try:
        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            for text in stream.text_stream:
                yield text
    except anthropic.AuthenticationError:
        raise RuntimeError("Invalid Anthropic API key. Please check your configuration.") from None
    except anthropic.RateLimitError:
        raise RuntimeError("Anthropic API rate limit reached. Please try again later.") from None
    except anthropic.APIConnectionError:
        raise RuntimeError("Could not connect to the Anthropic API. Check your network connection.") from None
    except anthropic.APIStatusError as e:
        raise RuntimeError(f"Anthropic API error ({e.status_code}): {e.message}") from e
