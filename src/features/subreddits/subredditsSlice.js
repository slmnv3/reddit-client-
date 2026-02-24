import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSubreddits } from '../../api/reddit';

export const loadSubreddits = createAsyncThunk(
  'subreddits/loadSubreddits',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchSubreddits();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState: {
    subreddits: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
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
        state.error = action.payload || 'Failed to load subreddits';
      });
  },
});

export const { clearError } = subredditsSlice.actions;

export const selectSubreddits = (state) => state.subreddits.subreddits;
export const selectSubredditsLoading = (state) => state.subreddits.isLoading;
export const selectSubredditsError = (state) => state.subreddits.error;

export default subredditsSlice.reducer;