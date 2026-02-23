import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPosts, searchPosts } from '../../api/reddit';

export const loadPosts = createAsyncThunk(
  'posts/loadPosts',
  async (subreddit) => {
    return await fetchPosts(subreddit);
  }
);

export const searchForPosts = createAsyncThunk(
  'posts/searchForPosts',
  async (searchTerm) => {
    return await searchPosts(searchTerm);
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    selectedSubreddit: 'popular'
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedSubreddit: (state, action) => {
      state.selectedSubreddit = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(searchForPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchForPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(searchForPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSearchTerm, setSelectedSubreddit } = postsSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectIsLoading = (state) => state.posts.isLoading;
export const selectError = (state) => state.posts.error;
export const selectSearchTerm = (state) => state.posts.searchTerm;
export const selectSelectedSubreddit = (state) => state.posts.selectedSubreddit;

export default postsSlice.reducer;