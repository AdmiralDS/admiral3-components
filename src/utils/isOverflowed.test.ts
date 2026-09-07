import { describe, expect, it } from 'vitest';

import { isOverflowed } from './isOverflowed';

function createElementWithDimensions({
  clientHeight = 100,
  clientWidth = 100,
  scrollHeight = 100,
  scrollWidth = 100,
}: Partial<Record<'clientHeight' | 'clientWidth' | 'scrollHeight' | 'scrollWidth', number>> = {}) {
  const element = document.createElement('div');

  Object.defineProperties(element, {
    clientHeight: { configurable: true, value: clientHeight },
    clientWidth: { configurable: true, value: clientWidth },
    scrollHeight: { configurable: true, value: scrollHeight },
    scrollWidth: { configurable: true, value: scrollWidth },
  });

  return element;
}

describe('isOverflowed', () => {
  it('returns false for a missing element or content that fits', () => {
    expect(isOverflowed(null)).toBe(false);
    expect(isOverflowed(createElementWithDimensions())).toBe(false);
  });

  it('detects horizontal overflow', () => {
    expect(isOverflowed(createElementWithDimensions({ scrollWidth: 101 }))).toBe(true);
  });

  it('detects vertical overflow', () => {
    expect(isOverflowed(createElementWithDimensions({ scrollHeight: 101 }))).toBe(true);
  });
});
