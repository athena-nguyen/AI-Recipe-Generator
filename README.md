# AI Recipe Generator

## Live Demo

**Try it here:** [aileftoverrecipegen.netlify.app](https://aileftoverrecipegen.netlify.app/)

> **Note:** The live demo runs without an active AI backend, so it will display a sample recipe regardless of what ingredients you enter. This lets you explore the full UI, design, and recipe format without needing any credentials.
>
> If you'd like to generate real recipes from your own ingredients using Anthropic Claude, clone the project and add your own API key — instructions below.

---

Turn leftover ingredients into a full cookbook-style recipe — powered by Anthropic Claude.

Enter what's in your pantry, pick a meal type and dietary preference, and the app streams a formatted recipe back to you in real time: ingredients, step-by-step instructions, chef's tips, and a nutrition breakdown.

---

## Features

- **Tag-based ingredient input** — type an ingredient and press Enter or comma to add it
- **Meal type & dietary preference** — filter by Breakfast, Lunch, Dinner, Snack, Dessert, and preferences like Vegan, Gluten-Free, etc.
- **Live streaming** — recipe text streams word-by-word as Claude generates it
- **Copy to clipboard** — grab the full recipe markdown with one click
- **Demo mode** — if no API key is configured, a sample recipe is shown automatically (see below)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, CSS Modules |
| Markdown | react-markdown + remark-gfm |
| Backend | Python, FastAPI, Server-Sent Events (SSE) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- An [Anthropic API key](https://console.anthropic.com/)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/AI-Recipe-Generator.git
cd AI-Recipe-Generator
```

---

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

Open `backend/.env` and fill in your key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

The API will be running at `http://localhost:8000`.

---

### 3. Set up the frontend

In a new terminal:

```bash
cd frontend
npm install
```

Create the frontend env file:

```bash
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Demo Mode

If the backend can't reach the Anthropic API — either because no API key is set or the server is unavailable — the app will automatically display a complete sample recipe (Garlic Herb Roasted Chicken Thighs) instead of showing an error screen.

A warning banner will appear at the top of the recipe card letting you know the AI wasn't reachable, so you can still explore the full UI and recipe format without any credentials.

---

## Project Structure

```
AI-Recipe-Generator/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── recipe_request.py      # Pydantic request model
│   ├── routers/
│   │   └── recipe.py              # POST /api/generate-recipe (SSE)
│   └── services/
│       └── anthropic_service.py   # Claude streaming + prompt
│
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── api/recipeApi.ts        # SSE fetch client
    │   ├── hooks/useRecipeGeneration.ts
    │   ├── data/sampleRecipe.ts    # Fallback recipe
    │   └── components/
    │       ├── RecipeForm/
    │       └── RecipeDisplay/
    └── vite.config.ts
```

---

## API

```
POST /api/generate-recipe
Content-Type: application/json

{
  "ingredients": ["chicken", "garlic", "lemon"],
  "meal_type": "Dinner",
  "servings": 4,
  "dietary_restrictions": ["Gluten-Free"]
}

Response: text/event-stream (SSE)
```
