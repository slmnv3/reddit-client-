import styles from './ErrorState.module.css';

export default function ErrorState({ message, onRetry }) {
  const isRateLimited = message?.toLowerCase().includes('rate');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.emoji}>
          {isRateLimited ? '⏳' : '😞'}
        </span>
        <h2 className={styles.title}>
          {isRateLimited ? 'Slow down!' : 'Something went wrong!'}
        </h2>
        <p className={styles.message}>
          {message || 'Failed to load data.'}
        </p>
        {isRateLimited && (
          <p className={styles.hint}>
            Reddit limits free API usage to 10 requests per minute.
            Please wait a moment before trying again.
          </p>
        )}
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}