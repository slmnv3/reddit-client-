import { describe, it, expect } from 'vitest';
import postsReducer, {
  setSearchTerm,
  setSelectedSubreddit,
  clearError,
} from '../postsSlice';

describe('postsSlice', () => {
  const initialState = {
    posts: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    selectedSubreddit: 'popular',
  };

  it('should return the initial state', () => {
    expect(postsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSearchTerm', () => {
    const state = postsReducer(initialState, setSearchTerm('react'));
    expect(state.searchTerm).toBe('react');
  });

  it('should handle setSelectedSubreddit', () => {
    const state = postsReducer(initialState, setSelectedSubreddit('javascript'));
    expect(state.selectedSubreddit).toBe('javascript');
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const state = postsReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });

  it('should handle loadPosts.pending', () => {
    const state = postsReducer(initialState, { type: 'posts/loadPosts/pending' });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadPosts.fulfilled', () => {
    const mockPosts = [{ id: '1', title: 'Test' }];
    const state = postsReducer(initialState, {
      type: 'posts/loadPosts/fulfilled',
      payload: mockPosts,
    });
    expect(state.isLoading).toBe(false);
    expect(state.posts).toEqual(mockPosts);
  });

  it('should handle loadPosts.rejected', () => {
    const state = postsReducer(initialState, {
      type: 'posts/loadPosts/rejected',
      payload: 'Failed to load',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Failed to load');
  });

  it('should handle searchForPosts.pending', () => {
    const state = postsReducer(initialState, { type: 'posts/searchForPosts/pending' });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle searchForPosts.fulfilled', () => {
    const mockPosts = [{ id: '1', title: 'Search Result' }];
    const state = postsReducer(initialState, {
      type: 'posts/searchForPosts/fulfilled',
      payload: mockPosts,
    });
    expect(state.isLoading).toBe(false);
    expect(state.posts).toEqual(mockPosts);
  });

  it('should handle searchForPosts.rejected', () => {
    const state = postsReducer(initialState, {
      type: 'posts/searchForPosts/rejected',
      payload: 'Search failed',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Search failed');
  });
});