import type { RecipeFormData } from '../types/recipe';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function fetchRecipeStream(
  formData: RecipeFormData,
  onChunk: (text: string) => void,
  signal: AbortSignal
): Promise<void> {
  const body = {
    ingredients: formData.ingredients,
    meal_type: formData.mealType || null,
    servings: formData.servings === '' ? null : formData.servings,
    dietary_restrictions:
      formData.dietaryRestriction && formData.dietaryRestriction !== 'No restrictions'
        ? [formData.dietaryRestriction]
        : [],
  };

  const response = await fetch(`${API_BASE}/api/generate-recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error ${response.status}: ${text}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const lines = part.split('\n');
      const eventLine = lines.find(l => l.startsWith('event:'));
      const dataLines = lines.filter(l => l.startsWith('data:'));
      if (dataLines.length === 0) continue;
      const data = dataLines.map(l => l.slice('data: '.length)).join('\n');
      if (eventLine?.includes('error')) {
        throw new Error(JSON.parse(data));
      }
      if (data === '[DONE]') return;
      onChunk(data);
    }
  }
}
