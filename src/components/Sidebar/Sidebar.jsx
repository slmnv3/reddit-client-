import { SidebarSkeleton } from '../Skeleton/Skeleton';
import styles from './Sidebar.module.css';

export default function Sidebar({
  subreddits,
  selectedSubreddit,
  onSelectSubreddit,
  isLoading,
  error,
  onRetry,
}) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Subreddits</h2>

      {isLoading && <SidebarSkeleton />}

      {error && (
        <div className={styles.error}>
          <p>Failed to load subreddits</p>
          <button className={styles.retryButton} onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <ul className={styles.list}>
          {subreddits.map((sub) => (
            <li key={sub.id}>
              <button
                className={`${styles.item} ${
                  selectedSubreddit === sub.display_name ? styles.active : ''
                }`}
                onClick={() => onSelectSubreddit(sub.display_name)}
              >
                {sub.icon_img ? (
                  <img
                    src={sub.icon_img}
                    alt={sub.display_name}
                    className={styles.iconImg}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span
                  className={styles.icon}
                  style={{
                    backgroundColor: sub.primary_color || '#7C3AED',
                    display: sub.icon_img ? 'none' : 'flex',
                  }}
                >
                  {sub.display_name[0].toUpperCase()}
                </span>
                <span className={styles.name}>r/{sub.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}