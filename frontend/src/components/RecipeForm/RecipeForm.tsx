import { useState, useRef } from 'react';
import type { RecipeFormData, GenerationStatus } from '../../types/recipe';
import styles from './RecipeForm.module.css';

const MEAL_TYPES = ['Any', 'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const DIETARY_OPTIONS = [
  'No restrictions',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Carb',
  'Halal',
  'Kosher',
];

const SERVINGS_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12];

interface Props {
  status: GenerationStatus;
  onGenerate: (data: RecipeFormData) => void;
}

export function RecipeForm({ status, onGenerate }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [mealType, setMealType] = useState('Any');
  const [servings, setServings] = useState<number | ''>(4);
  const [dietaryRestriction, setDietaryRestriction] = useState('No restrictions');
  const inputRef = useRef<HTMLInputElement>(null);

  const isStreaming = status === 'streaming';
  const canSubmit = ingredients.length > 0 && !isStreaming;

  function addIngredient(raw: string) {
    const trimmed = raw.replace(/,/g, '').trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setInputValue('');
  }

  function removeIngredient(tag: string) {
    setIngredients((prev) => prev.filter((i) => i !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0) {
      setIngredients((prev) => prev.slice(0, -1));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.endsWith(',')) {
      addIngredient(val);
    } else {
      setInputValue(val);
    }
  }

  function handleInputBlur() {
    if (inputValue.trim()) addIngredient(inputValue);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({ ingredients, mealType, servings, dietaryRestriction });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Ingredient tag input */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Your Ingredients</label>
        <div
          className={styles.tagInput}
          onClick={() => inputRef.current?.focus()}
        >
          {ingredients.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              <button
                type="button"
                className={styles.tagRemove}
                onClick={() => removeIngredient(tag)}
                aria-label={`Remove ${tag}`}
                disabled={isStreaming}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className={styles.tagTextInput}
            placeholder={ingredients.length === 0 ? 'Type an ingredient and press Enter...' : 'Add more...'}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            disabled={isStreaming}
          />
        </div>
        <p className={styles.hint}>Press Enter or comma after each ingredient</p>
      </div>

      {/* Dropdowns row */}
      <div className={styles.dropdownRow}>
        <div className={styles.field}>
          <label htmlFor="mealType" className={styles.fieldLabel}>Meal Type</label>
          <div className={styles.selectWrapper}>
            <select
              id="mealType"
              className={styles.select}
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              disabled={isStreaming}
            >
              {MEAL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className={styles.selectArrow}>▾</span>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="dietary" className={styles.fieldLabel}>Dietary Preference</label>
          <div className={styles.selectWrapper}>
            <select
              id="dietary"
              className={styles.select}
              value={dietaryRestriction}
              onChange={(e) => setDietaryRestriction(e.target.value)}
              disabled={isStreaming}
            >
              {DIETARY_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <span className={styles.selectArrow}>▾</span>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="servings" className={styles.fieldLabel}>Servings</label>
          <div className={styles.selectWrapper}>
            <select
              id="servings"
              className={styles.select}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              disabled={isStreaming}
            >
              {SERVINGS_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'serving' : 'servings'}</option>
              ))}
            </select>
            <span className={styles.selectArrow}>▾</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className={styles.button} disabled={!canSubmit}>
        Generate Recipe →
      </button>
    </form>
  );
}
