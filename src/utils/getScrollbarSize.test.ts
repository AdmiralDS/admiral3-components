import { afterEach, describe, expect, it, vi } from 'vitest';

import { getScrollbarSize } from './getScrollbarSize';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getScrollbarSize', () => {
  it('returns the measured scrollbar width and removes the measurement element', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(85);
    const childrenCount = document.body.childElementCount;

    expect(getScrollbarSize()).toBe(15);
    expect(document.body.childElementCount).toBe(childrenCount);
  });

  it('returns the visual fallback width for an overlay scrollbar', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);

    expect(getScrollbarSize()).toBe(16);
  });

  it('measures the scrollbar in the provided document', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(84);
    const targetDocument = document.implementation.createHTMLDocument();
    const createElement = vi.spyOn(targetDocument, 'createElement');

    expect(getScrollbarSize(targetDocument)).toBe(16);
    expect(createElement).toHaveBeenCalledWith('div');
    expect(targetDocument.body.childElementCount).toBe(0);
  });
});
