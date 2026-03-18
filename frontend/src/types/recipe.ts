export interface RecipeFormData {
  ingredients: string[];
  mealType: string;
  servings: number | '';
  dietaryRestriction: string;
}

export type GenerationStatus = 'idle' | 'streaming' | 'complete' | 'error';
