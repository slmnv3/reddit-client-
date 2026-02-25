import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Comment from '../Comment';

const mockComment = {
  id: 'c1',
  author: 'commenter1',
  body: 'This is a great post!',
  score: 42,
  created_utc: Date.now() / 1000 - 3600,
};

describe('Comment', () => {
  it('should render the comment author', () => {
  render(<Comment comment={mockComment} />);
  expect(screen.getByText(/commenter1/)).toBeInTheDocument();
  });

  it('should render the comment body', () => {
    render(<Comment comment={mockComment} />);
    expect(screen.getByText('This is a great post!')).toBeInTheDocument();
  });

  it('should render the comment score', () => {
    render(<Comment comment={mockComment} />);
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it('should render the time ago', () => {
    render(<Comment comment={mockComment} />);
    expect(screen.getByText('1h ago')).toBeInTheDocument();
  });

  it('should not render deleted comments', () => {
    const deletedComment = {
      ...mockComment,
      author: '[deleted]',
    };
    const { container } = render(<Comment comment={deletedComment} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render comments with no author', () => {
    const noAuthorComment = {
      ...mockComment,
      author: null,
    };
    const { container } = render(<Comment comment={noAuthorComment} />);
    expect(container.firstChild).toBeNull();
  });
});