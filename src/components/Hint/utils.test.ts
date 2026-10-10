import { afterEach, describe, expect, it, vi } from 'vitest';

import { HINT_MOBILE_BREAKPOINT } from './constants';
import { getMobileHintDirection, stretchToViewportWidth } from './utils';

describe('Hint utils', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not override direction outside a mobile viewport', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(HINT_MOBILE_BREAKPOINT);

    expect(getMobileHintDirection(target, new DOMRect(0, 0, 100, 40), hint)).toBeNull();
  });

  it('does not override direction when the target has no window', () => {
    const ownerDocument = document.implementation.createHTMLDocument();
    const target = ownerDocument.createElement('button');
    const hint = ownerDocument.createElement('div');

    expect(getMobileHintDirection(target, new DOMRect(0, 0, 100, 40), hint)).toBeNull();
  });

  it.each([
    ['bottomPageCenter', 400],
    ['topPageCenter', 700],
  ] as const)('chooses %s according to available mobile viewport space', (direction, targetBottom) => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(HINT_MOBILE_BREAKPOINT - 1);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
    vi.spyOn(hint, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 300, 200));

    expect(getMobileHintDirection(target, new DOMRect(0, targetBottom - 40, 100, 40), hint)).toBe(direction);
  });

  it('stretches the portal to the viewport width', () => {
    const portal = document.createElement('div');

    stretchToViewportWidth(portal);

    expect(portal).toHaveStyle({ left: '0px', width: '100%' });
  });
});
