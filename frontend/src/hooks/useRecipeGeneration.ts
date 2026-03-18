import { useState, useRef, useCallback } from 'react';
import { fetchRecipeStream } from '../api/recipeApi';
import { SAMPLE_RECIPE } from '../data/sampleRecipe';
import type { RecipeFormData, GenerationStatus } from '../types/recipe';

export function useRecipeGeneration() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generateRecipe = useCallback(async (formData: RecipeFormData) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setMarkdownContent('');
    setError(null);
    setIsFallback(false);
    setStatus('streaming');

    try {
      await fetchRecipeStream(
        formData,
        (chunk) => setMarkdownContent((prev) => prev + chunk),
        controller.signal
      );
      setStatus('complete');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      // Show sample recipe with a fallback notice instead of a dead error screen
      setMarkdownContent(SAMPLE_RECIPE);
      setIsFallback(true);
      setStatus('complete');
    }
  }, []);

  return { markdownContent, status, error, isFallback, generateRecipe };
}
