import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Posts from './features/posts/Posts';
import PostDetail from './features/postDetail/PostDetail';
import {
  loadSubreddits,
  selectSubreddits,
  selectSubredditsLoading,
  selectSubredditsError,
} from './features/subreddits/subredditsSlice';
import {
  loadPosts,
  searchForPosts,
  setSearchTerm,
  setSelectedSubreddit,
  selectSearchTerm,
  selectSelectedSubreddit,
} from './features/posts/postsSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);
  const subreddits = useSelector(selectSubreddits);
  const subredditsLoading = useSelector(selectSubredditsLoading);
  const subredditsError = useSelector(selectSubredditsError);

  useEffect(() => {
    dispatch(loadSubreddits());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadPosts(selectedSubreddit));
  }, [dispatch, selectedSubreddit]);

  const handleSearchSubmit = (term) => {
    dispatch(setSearchTerm(term));
    if (term.trim()) {
      dispatch(searchForPosts(term));
    } else {
      dispatch(loadPosts(selectedSubreddit));
    }
  };

  const handleSelectSubreddit = (subreddit) => {
    dispatch(setSelectedSubreddit(subreddit));
    dispatch(setSearchTerm(''));
  };

  return (
    <div className="app">
      <Header
        searchTerm={searchTerm}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className="layout">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/post/:subreddit/:postId" element={<PostDetail />} />
          </Routes>
        </div>
        <Sidebar
          subreddits={subreddits}
          selectedSubreddit={selectedSubreddit}
          onSelectSubreddit={handleSelectSubreddit}
          isLoading={subredditsLoading}
          error={subredditsError}
          onRetry={() => dispatch(loadSubreddits())}
        />
      </div>
    </div>
  );
}

export default App;