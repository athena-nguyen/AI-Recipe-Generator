import styles from './LoadingSpinner.module.css';

export function LoadingSpinner() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Generating recipe">
      <div className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <p className={styles.label}>Consulting the culinary muse…</p>
    </div>
  );
}
