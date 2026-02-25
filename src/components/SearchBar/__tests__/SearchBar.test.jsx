import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('should render the search input', () => {
    render(<SearchBar searchTerm="" onSearchSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search Reddit...')).toBeInTheDocument();
  });

  it('should display the initial search term', () => {
    render(<SearchBar searchTerm="react" onSearchSubmit={vi.fn()} />);
    expect(screen.getByDisplayValue('react')).toBeInTheDocument();
  });

  it('should update input value when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar searchTerm="" onSearchSubmit={vi.fn()} />);

    const input = screen.getByPlaceholderText('Search Reddit...');
    await user.type(input, 'javascript');

    expect(input.value).toBe('javascript');
  });

  it('should call onSearchSubmit when form is submitted', () => {
    const onSearchSubmit = vi.fn();
    render(<SearchBar searchTerm="" onSearchSubmit={onSearchSubmit} />);

    const input = screen.getByPlaceholderText('Search Reddit...');
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.submit(input.closest('form'));

    expect(onSearchSubmit).toHaveBeenCalledWith('react');
  });

  it('should render the search icon', () => {
    render(<SearchBar searchTerm="" onSearchSubmit={vi.fn()} />);
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });
});