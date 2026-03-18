import { RecipeForm } from './components/RecipeForm/RecipeForm';
import { RecipeDisplay } from './components/RecipeDisplay/RecipeDisplay';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useRecipeGeneration } from './hooks/useRecipeGeneration';
import styles from './App.module.css';

function App() {
  const { markdownContent, status, error, isFallback, generateRecipe } = useRecipeGeneration();

  const showLoader = status === 'streaming' && !markdownContent;
  const showRecipe = (status === 'streaming' && !!markdownContent) || status === 'complete' || status === 'error';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero header */}
        <header className={styles.header}>
          <p className={styles.eyebrow}>AI-Powered Kitchen</p>
          <h1 className={styles.title}>
            What's in your <em className={styles.titleAccent}>pantry?</em>
          </h1>
          <p className={styles.subtitle}>add your ingredients — we'll do the rest</p>
        </header>

        {/* Form */}
        <section className={styles.formSection}>
          <RecipeForm status={status} onGenerate={generateRecipe} />
        </section>

        {/* Loading dots — shown while waiting for first chunk */}
        {showLoader && (
          <section className={styles.recipeSection}>
            <div className={styles.divider} />
            <LoadingSpinner />
          </section>
        )}

        {/* Recipe output — shown once content starts streaming */}
        {showRecipe && (
          <section className={styles.recipeSection}>
            <div className={styles.divider} />
            <RecipeDisplay
              markdownContent={markdownContent}
              status={status}
              error={error}
              isFallback={isFallback}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
