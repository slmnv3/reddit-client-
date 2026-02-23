import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPostComments } from '../../api/reddit';

export const loadComments = createAsyncThunk(
  'postDetail/loadComments',
  async (permalink) => {
    return await fetchPostComments(permalink);
  }
);

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState: {
    post: null,
    comments: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setSelectedPost: (state, action) => {
      state.post = action.payload;
    }
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
        state.error = action.error.message;
      });
  }
});

export const { setSelectedPost } = postDetailSlice.actions;
export const selectPost = (state) => state.postDetail.post;
export const selectComments = (state) => state.postDetail.comments;
export const selectIsLoading = (state) => state.postDetail.isLoading;
export const selectError = (state) => state.postDetail.error;

export default postDetailSlice.reducer;