import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { GenerationStatus } from '../../types/recipe';
import styles from './RecipeDisplay.module.css';

interface Props {
  markdownContent: string;
  status: GenerationStatus;
  error: string | null;
  isFallback: boolean;
}

interface ParsedRecipe {
  title: string;
  serves: string | null;
  totalTime: string | null;
  body: string;
}

function parseRecipe(markdown: string): ParsedRecipe {
  const titleMatch = markdown.match(/^# (.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const servingsMatch = markdown.match(/\|\s*\*\*Servings\*\*\s*\|\s*([^|\n]+)\|/);
  const serves = servingsMatch ? servingsMatch[1].trim() : null;

  const totalTimeMatch = markdown.match(/\|\s*\*\*Total Time\*\*\s*\|\s*([^|\n]+)\|/);
  const totalTime = totalTimeMatch ? totalTimeMatch[1].trim() : null;

  const body = markdown
    .replace(/^# [^\n]+\n?/m, '')
    .replace(/(?:^|\n)## At a Glance\n[\s\S]*?(?=\n## |\n# |$)/, '');

  return { title, serves, totalTime, body };
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className={styles.sectionLabel}>{children}</h2>
  ),
  blockquote: ({ children }) => (
    <blockquote className={styles.description}>{children}</blockquote>
  ),
  ul: ({ children }) => (
    <ul className={styles.ingredientsList}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className={styles.stepsList}>{children}</ol>
  ),
  table: ({ children }) => (
    <table className={styles.nutritionTable}>{children}</table>
  ),
};

export function RecipeDisplay({ markdownContent, status, isFallback }: Props) {
  const { title, serves, totalTime, body } = parseRecipe(markdownContent);
  const isStreaming = status === 'streaming';

  function handleCopy() {
    navigator.clipboard.writeText(markdownContent);
  }

  return (
    <div className={`${styles.card} ${isStreaming ? styles.streaming : ''}`}>
      {isFallback && (
        <div className={styles.fallbackBanner}>
          <span>⚠</span>
          <span>
            Couldn't connect to the AI — no API key found or the server is unreachable.
            Here's a sample recipe so you can see how the app works.
          </span>
        </div>
      )}

      {/* Title block */}
      {title && (
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {(serves || totalTime) && (
            <p className={styles.meta}>
              {serves && (
                <>
                  <span className={styles.diamond}>◆</span>
                  {` Serves ${serves} `}
                </>
              )}
              {serves && totalTime && <span className={styles.diamond}>◆</span>}
              {totalTime && ` ${totalTime}`}
            </p>
          )}
        </div>
      )}

      {/* Recipe body */}
      <div className={styles.body}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {title ? body : markdownContent}
        </ReactMarkdown>
      </div>

      {status === 'complete' && (
        <button className={styles.copyButton} onClick={handleCopy}>
          Copy Recipe
        </button>
      )}
    </div>
  );
}
