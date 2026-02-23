import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSubreddits } from '../../api/reddit';

export const loadSubreddits = createAsyncThunk(
  'subreddits/loadSubreddits',
  async () => {
    return await fetchSubreddits();
  }
);

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState: {
    subreddits: [],
    isLoading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSubreddits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadSubreddits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subreddits = action.payload;
      })
      .addCase(loadSubreddits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const selectSubreddits = (state) => state.subreddits.subreddits;
export default subredditsSlice.reducer;