import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PostCardSkeleton, CommentSkeleton, SidebarSkeleton } from '../Skeleton';

describe('Skeleton Components', () => {
  it('should render PostCardSkeleton', () => {
    const { container } = render(<PostCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render CommentSkeleton', () => {
    const { container } = render(<CommentSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render SidebarSkeleton', () => {
    const { container } = render(<SidebarSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render multiple skeleton items in SidebarSkeleton', () => {
    const { container } = render(<SidebarSkeleton />);
    const items = container.querySelectorAll('div > div');
    expect(items.length).toBeGreaterThan(0);
  });
});