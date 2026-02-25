import { describe, it, expect } from 'vitest';
import postDetailReducer, {
  setSelectedPost,
  clearPostDetail,
  clearError,
} from '../postDetailSlice';

describe('postDetailSlice', () => {
  const initialState = {
    post: null,
    comments: [],
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(postDetailReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSelectedPost', () => {
    const mockPost = { id: '1', title: 'Test Post' };
    const state = postDetailReducer(initialState, setSelectedPost(mockPost));
    expect(state.post).toEqual(mockPost);
  });

  it('should handle clearPostDetail', () => {
    const stateWithData = {
      post: { id: '1' },
      comments: [{ id: 'c1' }],
      isLoading: false,
      error: 'Some error',
    };
    const state = postDetailReducer(stateWithData, clearPostDetail());
    expect(state.post).toBeNull();
    expect(state.comments).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Error' };
    const state = postDetailReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });

  it('should handle loadComments.pending', () => {
    const state = postDetailReducer(initialState, {
      type: 'postDetail/loadComments/pending',
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadComments.fulfilled', () => {
    const mockComments = [{ id: 'c1', body: 'Nice!' }];
    const state = postDetailReducer(initialState, {
      type: 'postDetail/loadComments/fulfilled',
      payload: mockComments,
    });
    expect(state.isLoading).toBe(false);
    expect(state.comments).toEqual(mockComments);
  });

  it('should handle loadComments.rejected', () => {
    const state = postDetailReducer(initialState, {
      type: 'postDetail/loadComments/rejected',
      payload: 'Failed to load comments',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Failed to load comments');
  });
});