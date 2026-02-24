import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Comment from '../../components/Comment/Comment';
import { CommentSkeleton } from '../../components/Skeleton/Skeleton';
import ErrorState from '../../components/ErrorState/ErrorState';
import { timeAgo } from '../../utils/timeAgo';
import { formatNumber } from '../../utils/formatNumber';
import { selectPosts } from '../posts/postsSlice';
import {
  loadComments,
  setSelectedPost,
  clearPostDetail,
  selectPost,
  selectComments,
  selectIsLoading,
  selectError,
} from './postDetailSlice';
import styles from './PostDetail.module.css';

export default function PostDetail() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const post = useSelector(selectPost);
  const comments = useSelector(selectComments);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [voteStatus, setVoteStatus] = useState(0);

  useEffect(() => {
    const foundPost = posts.find((p) => p.id === postId);
    if (foundPost) {
      dispatch(setSelectedPost(foundPost));
      dispatch(loadComments(foundPost.permalink));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearPostDetail());
    };
  }, [dispatch, posts, postId]);

  if (!post) {
    return (
      <ErrorState
        message="Post not found. Try going back and selecting a post."
        onRetry={() => window.history.back()}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>← Back to posts</Link>

      <article className={styles.post}>
        <div className={styles.voteSection}>
          <button
            className={`${styles.voteButton} ${voteStatus === 1 ? styles.upvoted : ''}`}
            onClick={() => setVoteStatus(voteStatus === 1 ? 0 : 1)}
          >
            ⬆️
          </button>
          <span className={styles.score}>
            {formatNumber(post.score + voteStatus)}
          </span>
          <button
            className={`${styles.voteButton} ${voteStatus === -1 ? styles.downvoted : ''}`}
            onClick={() => setVoteStatus(voteStatus === -1 ? 0 : -1)}
          >
            ⬇️
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.meta}>
            <span className={styles.subreddit}>{post.subreddit_name_prefixed}</span>
            <span className={styles.separator}>•</span>
            <span className={styles.author}>u/{post.author}</span>
            <span className={styles.separator}>•</span>
            <span className={styles.time}>{timeAgo(post.created_utc)}</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>

          {post.post_hint === 'image' && post.url && (
            <div className={styles.imageContainer}>
              <img
                src={post.url}
                alt={post.title}
                className={styles.image}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {post.selftext && (
            <div className={styles.body}>{post.selftext}</div>
          )}
        </div>
      </article>

      <section className={styles.comments}>
        <h2 className={styles.commentsTitle}>
          Comments ({formatNumber(post.num_comments)})
        </h2>

        {error && (
          <ErrorState
            message={error}
            onRetry={() => dispatch(loadComments(post.permalink))}
          />
        )}

        {isLoading ? (
          [...Array(4)].map((_, i) => <CommentSkeleton key={i} />)
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id} style={{ animationDelay: `${index * 100}ms` }}>
              <Comment comment={comment} />
            </div>
          ))
        )}
      </section>
    </div>
  );
}