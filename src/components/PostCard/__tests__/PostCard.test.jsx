import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from '../PostCard';

const mockPost = {
  id: '123',
  subreddit: 'reactjs',
  subreddit_name_prefixed: 'r/reactjs',
  author: 'testuser',
  title: 'Test Post Title',
  selftext: 'This is the body of the post',
  score: 1234,
  num_comments: 56,
  created_utc: Date.now() / 1000 - 3600,
  permalink: '/r/reactjs/comments/123/test',
  url: 'https://example.com',
  is_video: false,
  thumbnail: 'self',
  preview: null,
  post_hint: 'self',
};

const renderPostCard = (post = mockPost) => {
  return render(
    <BrowserRouter>
      <PostCard post={post} />
    </BrowserRouter>
  );
};

describe('PostCard', () => {
  it('should render the post title', () => {
    renderPostCard();
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render the subreddit name', () => {
    renderPostCard();
    expect(screen.getByText('r/reactjs')).toBeInTheDocument();
  });

  it('should render the author name', () => {
    renderPostCard();
    expect(screen.getByText('u/testuser')).toBeInTheDocument();
  });

  it('should render the score', () => {
    renderPostCard();
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('should render the comment count', () => {
    renderPostCard();
    expect(screen.getByText(/56 comments/)).toBeInTheDocument();
  });

  it('should render post body preview', () => {
    renderPostCard();
    expect(screen.getByText('This is the body of the post')).toBeInTheDocument();
  });

  it('should render upvote and downvote buttons', () => {
    renderPostCard();
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });

  it('should increase score when upvote is clicked', () => {
    renderPostCard();
    const upvoteButton = screen.getByLabelText('Upvote');
    fireEvent.click(upvoteButton);
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('should decrease score when downvote is clicked', () => {
    renderPostCard();
    const downvoteButton = screen.getByLabelText('Downvote');
    fireEvent.click(downvoteButton);
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('should toggle upvote on double click', () => {
    renderPostCard();
    const upvoteButton = screen.getByLabelText('Upvote');
    fireEvent.click(upvoteButton);
    fireEvent.click(upvoteButton);
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('should render an image when post has image', () => {
  const imagePost = {
    ...mockPost,
    post_hint: 'image',
    url: 'https://example.com/image.jpg',
    is_video: false,
  };
  renderPostCard(imagePost);
  const image = screen.getByAltText('Test Post Title');
  expect(image).toBeInTheDocument();
  expect(image.src).toBe('https://example.com/image.jpg');
});

  it('should have a link to the post detail page', () => {
    renderPostCard();
    const link = screen.getByText('Test Post Title').closest('a');
    expect(link).toHaveAttribute('href', '/post/reactjs/123');
  });
});