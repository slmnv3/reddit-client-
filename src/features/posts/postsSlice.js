import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPosts, searchPosts } from '../../api/reddit';

export const loadPosts = createAsyncThunk(
  'posts/loadPosts',
  async (subreddit, { rejectWithValue }) => {
    try {
      return await fetchPosts(subreddit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchForPosts = createAsyncThunk(
  'posts/searchForPosts',
  async (searchTerm, { rejectWithValue }) => {
    try {
      return await searchPosts(searchTerm);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    selectedSubreddit: 'popular',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedSubreddit: (state, action) => {
      state.selectedSubreddit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load posts
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
        state.error = action.payload || 'Failed to load posts';
      })
      // Search posts
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
        state.error = action.payload || 'Failed to search posts';
      });
  },
});

export const { setSearchTerm, setSelectedSubreddit, clearError } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;
export const selectIsLoading = (state) => state.posts.isLoading;
export const selectError = (state) => state.posts.error;
export const selectSearchTerm = (state) => state.posts.searchTerm;
export const selectSelectedSubreddit = (state) => state.posts.selectedSubreddit;

export default postsSlice.reducer;