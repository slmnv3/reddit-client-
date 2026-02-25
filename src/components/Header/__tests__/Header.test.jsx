import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

const renderHeader = (props = {}) => {
  const defaultProps = {
    searchTerm: '',
    onSearchSubmit: vi.fn(),
    ...props,
  };

  return render(
    <BrowserRouter>
      <Header {...defaultProps} />
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('should render the logo', () => {
    renderHeader();
    expect(screen.getByText('RedditLite')).toBeInTheDocument();
  });

  it('should render the search bar', () => {
    renderHeader();
    expect(screen.getByPlaceholderText('Search Reddit...')).toBeInTheDocument();
  });

  it('should render the logo icon', () => {
    renderHeader();
    expect(screen.getByText('🟣')).toBeInTheDocument();
  });
});