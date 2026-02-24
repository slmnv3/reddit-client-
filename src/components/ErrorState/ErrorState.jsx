import styles from './ErrorState.module.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.emoji}>😞</span>
        <h2 className={styles.title}>Something went wrong!</h2>
        <p className={styles.message}>{message || 'Failed to load data.'}</p>
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}