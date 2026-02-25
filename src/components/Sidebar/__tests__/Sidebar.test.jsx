import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

const mockSubreddits = [
  { id: '1', display_name: 'popular', icon_img: '', primary_color: '#7C3AED' },
  { id: '2', display_name: 'reactjs', icon_img: '', primary_color: '#61DAFB' },
  { id: '3', display_name: 'javascript', icon_img: '', primary_color: '#F7DF1E' },
];

const renderSidebar = (props = {}) => {
  const defaultProps = {
    subreddits: mockSubreddits,
    selectedSubreddit: 'popular',
    onSelectSubreddit: vi.fn(),
    isLoading: false,
    error: null,
    onRetry: vi.fn(),
    ...props,
  };

  return render(<Sidebar {...defaultProps} />);
};

describe('Sidebar', () => {
  it('should render the title', () => {
    renderSidebar();
    expect(screen.getByText('Subreddits')).toBeInTheDocument();
  });

  it('should render all subreddits', () => {
    renderSidebar();
    expect(screen.getByText('r/popular')).toBeInTheDocument();
    expect(screen.getByText('r/reactjs')).toBeInTheDocument();
    expect(screen.getByText('r/javascript')).toBeInTheDocument();
  });

  it('should call onSelectSubreddit when a subreddit is clicked', () => {
    const onSelectSubreddit = vi.fn();
    renderSidebar({ onSelectSubreddit });
    fireEvent.click(screen.getByText('r/reactjs'));
    expect(onSelectSubreddit).toHaveBeenCalledWith('reactjs');
  });

  it('should show loading skeleton when isLoading is true', () => {
    renderSidebar({ isLoading: true });
    expect(screen.queryByText('r/popular')).not.toBeInTheDocument();
  });

  it('should show error message when error exists', () => {
    renderSidebar({ error: 'Failed to load' });
    expect(screen.getByText('Failed to load subreddits')).toBeInTheDocument();
  });

  it('should show retry button when error exists', () => {
    const onRetry = vi.fn();
    renderSidebar({ error: 'Failed', onRetry });
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render first letter as icon when no icon_img', () => {
    renderSidebar();
    expect(screen.getByText('P')).toBeInTheDocument(); // Popular
    expect(screen.getByText('R')).toBeInTheDocument(); // Reactjs
    expect(screen.getByText('J')).toBeInTheDocument(); // Javascript
  });
});