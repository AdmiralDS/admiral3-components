import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTooltipDirection } from './getTooltipDirection';
import type { TooltipInternalPosition } from './types';

type Rect = { x: number; y: number; width: number; height: number };

const createElementWithRect = ({ x, y, width, height }: Rect) => {
  const element = document.createElement('div');
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(new DOMRect(x, y, width, height));
  return element;
};

const getDirection = (
  anchorRect: Rect,
  tooltipRect: Pick<Rect, 'width' | 'height'>,
  scrollbarSize = 0,
  tooltipPosition?: 'bottom' | 'top' | 'left' | 'right',
) =>
  getTooltipDirection(
    createElementWithRect(anchorRect),
    createElementWithRect({ x: 0, y: 0, ...tooltipRect }),
    scrollbarSize,
    tooltipPosition,
  );

describe('getTooltipDirection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each<[TooltipInternalPosition, Rect, Pick<Rect, 'width' | 'height'>]>([
    ['bottom', { x: 450, y: 350, width: 100, height: 100 }, { width: 100, height: 100 }],
    ['top', { x: 450, y: 700, width: 100, height: 50 }, { width: 100, height: 100 }],
    ['left', { x: 400, y: 350, width: 100, height: 100 }, { width: 100, height: 700 }],
    ['right', { x: 50, y: 350, width: 100, height: 100 }, { width: 200, height: 700 }],
    ['bottomRight', { x: 10, y: 10, width: 20, height: 20 }, { width: 200, height: 100 }],
    ['bottomLeft', { x: 970, y: 10, width: 20, height: 20 }, { width: 200, height: 100 }],
    ['topRight', { x: 10, y: 770, width: 20, height: 20 }, { width: 200, height: 100 }],
    ['topLeft', { x: 970, y: 770, width: 20, height: 20 }, { width: 200, height: 100 }],
    ['leftBottom', { x: 400, y: 10, width: 20, height: 20 }, { width: 100, height: 780 }],
    ['leftTop', { x: 400, y: 770, width: 20, height: 20 }, { width: 100, height: 780 }],
    ['rightBottom', { x: 10, y: 10, width: 20, height: 20 }, { width: 100, height: 780 }],
    ['rightTop', { x: 10, y: 770, width: 20, height: 20 }, { width: 100, height: 780 }],
    ['bottomPageCenter', { x: 200, y: 10, width: 20, height: 20 }, { width: 900, height: 100 }],
    ['topPageCenter', { x: 200, y: 770, width: 20, height: 20 }, { width: 900, height: 100 }],
  ])('selects %s according to the complete position priority', (expectedPosition, anchorRect, tooltipRect) => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);

    expect(getDirection(anchorRect, tooltipRect)).toBe(expectedPosition);
  });

  it('checks only positions compatible with the explicitly requested tooltipPosition', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);

    const anchorRect = { x: 100, y: 10, width: 20, height: 20 };
    const tooltipRect = { width: 100, height: 100 };

    expect(getDirection(anchorRect, tooltipRect)).toBe('bottom');
    expect(getDirection(anchorRect, tooltipRect, 0, 'right')).toBe('rightBottom');
  });

  it('accounts for the scrollbar size when calculating available viewport space', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 300);

    const anchorRect = { x: 450, y: 150, width: 100, height: 30 };
    const tooltipRect = { width: 100, height: 110 };

    expect(getDirection(anchorRect, tooltipRect)).toBe('bottom');
    expect(getDirection(anchorRect, tooltipRect, 16)).toBe('top');
  });
});
