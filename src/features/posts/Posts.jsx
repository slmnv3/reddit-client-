import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../components/PostCard/PostCard';
import { PostCardSkeleton } from '../../components/Skeleton/Skeleton';
import ErrorState from '../../components/ErrorState/ErrorState';
import {
  loadPosts,
  selectPosts,
  selectIsLoading,
  selectError,
  selectSearchTerm,
  selectSelectedSubreddit,
} from './postsSlice';
import styles from './Posts.module.css';

export default function Posts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const searchTerm = useSelector(selectSearchTerm);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);

  const handleRetry = () => {
    dispatch(loadPosts(selectedSubreddit));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        {[...Array(5)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  if (posts.length === 0) {
    return (
      <div className={styles.noResults}>
        <span className={styles.noResultsIcon}>🔍</span>
        <h2>No results found</h2>
        {searchTerm && <p>No results for "{searchTerm}". Try something else.</p>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {posts.map((post, index) => (
        <div key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}