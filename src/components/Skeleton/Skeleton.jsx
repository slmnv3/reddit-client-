import styles from './Skeleton.module.css';

export function PostCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.voteSection}>
        <div className={`${styles.bone} ${styles.voteButton}`}></div>
        <div className={`${styles.bone} ${styles.score}`}></div>
        <div className={`${styles.bone} ${styles.voteButton}`}></div>
      </div>
      <div className={styles.content}>
        <div className={`${styles.bone} ${styles.meta}`}></div>
        <div className={`${styles.bone} ${styles.title}`}></div>
        <div className={`${styles.bone} ${styles.titleShort}`}></div>
        <div className={`${styles.bone} ${styles.text}`}></div>
        <div className={`${styles.bone} ${styles.actions}`}></div>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className={styles.comment}>
      <div className={`${styles.bone} ${styles.commentMeta}`}></div>
      <div className={`${styles.bone} ${styles.commentBody}`}></div>
      <div className={`${styles.bone} ${styles.commentBodyShort}`}></div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className={styles.sidebarItem}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`${styles.bone} ${styles.subItem}`}></div>
      ))}
    </div>
  );
}