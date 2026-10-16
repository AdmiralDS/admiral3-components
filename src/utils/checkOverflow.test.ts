import { describe, expect, it } from 'vitest';

import { checkOverflow } from './checkOverflow';

describe('checkOverflow', () => {
  it('returns false for null', () => {
    expect(checkOverflow(null)).toBe(false);
  });

  it.each([
    {
      name: 'equal dimensions',
      offsetWidth: 100,
      scrollWidth: 100,
      offsetHeight: 20,
      scrollHeight: 20,
      expected: false,
    },
    { name: 'smaller content', offsetWidth: 100, scrollWidth: 90, offsetHeight: 20, scrollHeight: 10, expected: false },
    {
      name: 'horizontal overflow by one pixel',
      offsetWidth: 100,
      scrollWidth: 101,
      offsetHeight: 20,
      scrollHeight: 20,
      expected: true,
    },
    {
      name: 'vertical overflow by one pixel',
      offsetWidth: 100,
      scrollWidth: 100,
      offsetHeight: 20,
      scrollHeight: 21,
      expected: true,
    },
    {
      name: 'overflow on both axes',
      offsetWidth: 100,
      scrollWidth: 150,
      offsetHeight: 20,
      scrollHeight: 30,
      expected: true,
    },
    { name: 'zero dimensions', offsetWidth: 0, scrollWidth: 0, offsetHeight: 0, scrollHeight: 0, expected: false },
    {
      name: 'content inside zero width',
      offsetWidth: 0,
      scrollWidth: 1,
      offsetHeight: 0,
      scrollHeight: 0,
      expected: true,
    },
    {
      name: 'content inside zero height',
      offsetWidth: 0,
      scrollWidth: 0,
      offsetHeight: 0,
      scrollHeight: 1,
      expected: true,
    },
  ])('$name', ({ offsetWidth, scrollWidth, offsetHeight, scrollHeight, expected }) => {
    const element = document.createElement('span');
    Object.defineProperties(element, {
      offsetWidth: { value: offsetWidth },
      scrollWidth: { value: scrollWidth },
      offsetHeight: { value: offsetHeight },
      scrollHeight: { value: scrollHeight },
    });
    expect(checkOverflow(element)).toBe(expected);
  });
});
