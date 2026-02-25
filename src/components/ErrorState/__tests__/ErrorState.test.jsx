import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('should render the error message', () => {
    render(<ErrorState message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render default message when no message provided', () => {
    render(<ErrorState />);
    expect(screen.getByText('Failed to load data.')).toBeInTheDocument();
  });

  it('should render the title', () => {
    render(<ErrorState message="Error" />);
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    render(<ErrorState message="Error" onRetry={vi.fn()} />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Try Again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should show rate limit message for rate limit errors', () => {
    render(<ErrorState message="Rate limited by Reddit" />);
    expect(screen.getByText('Slow down!')).toBeInTheDocument();
    expect(screen.getByText(/Reddit limits free API/)).toBeInTheDocument();
  });

  it('should show sad emoji for regular errors', () => {
    render(<ErrorState message="Something broke" />);
    expect(screen.getByText('😞')).toBeInTheDocument();
  });

  it('should show timer emoji for rate limit errors', () => {
    render(<ErrorState message="Rate limited" />);
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });
});