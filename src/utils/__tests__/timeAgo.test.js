import { describe, it, expect } from 'vitest';
import { timeAgo } from '../timeAgo';

describe('timeAgo', () => {
  it('should return "just now" for current time', () => {
    const now = Date.now() / 1000;
    expect(timeAgo(now)).toBe('just now');
  });

  it('should return minutes ago', () => {
    const fiveMinutesAgo = Date.now() / 1000 - 300;
    expect(timeAgo(fiveMinutesAgo)).toBe('5m ago');
  });

  it('should return hours ago', () => {
    const threeHoursAgo = Date.now() / 1000 - 10800;
    expect(timeAgo(threeHoursAgo)).toBe('3h ago');
  });

  it('should return days ago', () => {
    const twoDaysAgo = Date.now() / 1000 - 172800;
    expect(timeAgo(twoDaysAgo)).toBe('2d ago');
  });

  it('should return months ago', () => {
    const twoMonthsAgo = Date.now() / 1000 - 5184000;
    expect(timeAgo(twoMonthsAgo)).toBe('2mo ago');
  });

  it('should return years ago', () => {
    const twoYearsAgo = Date.now() / 1000 - 63072000;
    expect(timeAgo(twoYearsAgo)).toBe('2y ago');
  });
});