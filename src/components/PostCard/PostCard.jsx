import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../../utils/timeAgo';
import { formatNumber } from '../../utils/formatNumber';
import styles from './PostCard.module.css';

export default function PostCard({ post }) {
  const [voteStatus, setVoteStatus] = useState(0);

  const handleUpvote = () => {
    setVoteStatus(voteStatus === 1 ? 0 : 1);
  };

  const handleDownvote = () => {
    setVoteStatus(voteStatus === -1 ? 0 : -1);
  };

  const currentScore = post.score + voteStatus;

  // Get image URL from Reddit post data
  const getImageUrl = () => {
    if (post.post_hint === 'image') return post.url;
    if (post.preview?.images?.[0]?.source?.url) {
      // Reddit HTML-encodes URLs in preview
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <article className={styles.card}>
      <div className={styles.voteSection}>
        <button
          className={`${styles.voteButton} ${voteStatus === 1 ? styles.upvoted : ''}`}
          onClick={handleUpvote}
          aria-label="Upvote"
        >
          ⬆️
        </button>
        <span className={styles.score}>{formatNumber(currentScore)}</span>
        <button
          className={`${styles.voteButton} ${voteStatus === -1 ? styles.downvoted : ''}`}
          onClick={handleDownvote}
          aria-label="Downvote"
        >
          ⬇️
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.subreddit}>
            {post.subreddit_name_prefixed}
          </span>
          <span className={styles.separator}>•</span>
          <span className={styles.author}>u/{post.author}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.time}>{timeAgo(post.created_utc)}</span>
        </div>

        <Link
          to={`/post/${post.subreddit}/${post.id}`}
          className={styles.titleLink}
        >
          <h2 className={styles.title}>{post.title}</h2>
        </Link>

        {post.selftext && (
          <p className={styles.preview}>
            {post.selftext.substring(0, 200)}
            {post.selftext.length > 200 ? '...' : ''}
          </p>
        )}

        {imageUrl && (
          <div className={styles.imageContainer}>
            <img
              src={imageUrl}
              alt={post.title}
              className={styles.image}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {post.is_video && post.media?.reddit_video?.fallback_url && (
          <div className={styles.videoContainer}>
            <video
              controls
              className={styles.video}
              src={post.media.reddit_video.fallback_url}
            />
          </div>
        )}

        <div className={styles.actions}>
          <Link
            to={`/post/${post.subreddit}/${post.id}`}
            className={styles.commentsButton}
          >
            💬 {formatNumber(post.num_comments)} comments
          </Link>
        </div>
      </div>
    </article>
  );
}