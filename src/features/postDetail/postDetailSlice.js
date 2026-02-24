import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPostComments } from '../../api/reddit';

export const loadComments = createAsyncThunk(
  'postDetail/loadComments',
  async (permalink, { rejectWithValue }) => {
    try {
      return await fetchPostComments(permalink);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState: {
    post: null,
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedPost: (state, action) => {
      state.post = action.payload;
    },
    clearPostDetail: (state) => {
      state.post = null;
      state.comments = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(loadComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load comments';
      });
  },
});

export const { setSelectedPost, clearPostDetail, clearError } = postDetailSlice.actions;

export const selectPost = (state) => state.postDetail.post;
export const selectComments = (state) => state.postDetail.comments;
export const selectIsLoading = (state) => state.postDetail.isLoading;
export const selectError = (state) => state.postDetail.error;

export default postDetailSlice.reducer;