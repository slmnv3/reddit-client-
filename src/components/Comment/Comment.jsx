import ReactMarkdown from 'react-markdown';
import { timeAgo } from '../../utils/timeAgo';
import { formatNumber } from '../../utils/formatNumber';
import styles from './Comment.module.css';

export default function Comment({ comment }) {
  // Skip deleted or removed comments
  if (!comment.author || comment.author === '[deleted]') {
    return null;
  }

  return (
    <div className={styles.comment}>
      <div className={styles.meta}>
        <span className={styles.author}>👤 u/{comment.author}</span>
        <span className={styles.separator}>•</span>
        <span className={styles.time}>{timeAgo(comment.created_utc)}</span>
      </div>
      <div className={styles.body}>
        <ReactMarkdown>{comment.body}</ReactMarkdown>
      </div>
      <div className={styles.actions}>
        <span className={styles.score}>⬆️ {formatNumber(comment.score)}</span>
      </div>
    </div>
  );
}