import { describe, it, expect } from 'vitest';
import { formatNumber } from '../formatNumber';

describe('formatNumber', () => {
  it('should return the number as string for numbers under 1000', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1)).toBe('1');
    expect(formatNumber(999)).toBe('999');
  });

  it('should format thousands with k', () => {
    expect(formatNumber(1000)).toBe('1.0k');
    expect(formatNumber(1500)).toBe('1.5k');
    expect(formatNumber(10000)).toBe('10.0k');
    expect(formatNumber(999999)).toBe('1000.0k');
  });

  it('should format millions with M', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(10000000)).toBe('10.0M');
  });
});