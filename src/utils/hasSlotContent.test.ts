import { describe, expect, it } from 'vitest';

import { hasSlotContent } from './hasSlotContent';

describe('hasSlotContent', () => {
  it.each([false, true, null, undefined, ''])('returns false for empty slot value %s', (content) => {
    expect(hasSlotContent(content)).toBe(false);
  });

  it.each([0, 'Slot content'])('returns true for renderable slot value %s', (content) => {
    expect(hasSlotContent(content)).toBe(true);
  });
});
