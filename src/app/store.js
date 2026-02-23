import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import postDetailReducer from '../features/postDetail/postDetailSlice';
import subredditsReducer from '../features/subreddits/subredditsSlice';

export default configureStore({
  reducer: {
    posts: postsReducer,
    postDetail: postDetailReducer,
    subreddits: subredditsReducer,
  }
});