import { afterEach, describe, expect, it, vi } from 'vitest';

import { getHintTooltipDirection } from './getHintTooltipDirection';
import type { HintTooltipInternalPosition, HintTooltipPosition } from './getHintTooltipDirection';
import { getScrollbarSize } from '../../../utils/getScrollbarSize';
import { HINT_POSITION_CONFIG } from '../../Hint/constants';
import { TOOLTIP_POSITION_CONFIG } from '../../Tooltip/constants';

vi.mock('../../../utils/getScrollbarSize', () => ({ getScrollbarSize: vi.fn(() => 0) }));

type Rect = { x: number; y: number; width: number; height: number };

const createElementWithRect = ({ x, y, width, height }: Rect) => {
  const element = document.createElement('div');
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(new DOMRect(x, y, width, height));
  return element;
};

const getDirection = (
  anchorRect: Rect,
  floatingRect: Pick<Rect, 'width' | 'height'>,
  position?: HintTooltipPosition,
  config = TOOLTIP_POSITION_CONFIG,
) =>
  getHintTooltipDirection(
    document.createElement('div'),
    new DOMRect(anchorRect.x, anchorRect.y, anchorRect.width, anchorRect.height),
    createElementWithRect({ x: 0, y: 0, ...floatingRect }),
    position,
    config,
  );

describe('getHintTooltipDirection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each<[HintTooltipInternalPosition, Rect, Pick<Rect, 'width' | 'height'>]>([
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
  ])('selects %s using the Tooltip priority', (expectedPosition, anchorRect, floatingRect) => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);

    expect(getDirection(anchorRect, floatingRect)).toBe(expectedPosition);
  });

  it('uses a reduced priority for an explicitly requested side', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);

    const anchorRect = { x: 100, y: 10, width: 20, height: 20 };
    const floatingRect = { width: 100, height: 100 };

    expect(getDirection(anchorRect, floatingRect)).toBe('bottom');
    expect(getDirection(anchorRect, floatingRect, 'right')).toBe('rightBottom');
  });

  it('supports a different priority and fallback for Hint', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);

    expect(
      getDirection(
        { x: 450, y: 350, width: 100, height: 100 },
        { width: 100, height: 100 },
        undefined,
        HINT_POSITION_CONFIG,
      ),
    ).toBe('bottomRight');
    expect(
      getDirection({ x: 0, y: 0, width: 10, height: 10 }, { width: 2000, height: 2000 }, 'top', HINT_POSITION_CONFIG),
    ).toBe('topRight');
  });

  it('uses the configured Tooltip fallback', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);

    expect(getDirection({ x: 0, y: 0, width: 10, height: 10 }, { width: 2000, height: 2000 }, 'left')).toBe('left');
  });

  it('performs the optional second pass using the document scroll space before fallback', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000);
    const fallbackPosition = vi.fn(() => 'top' as const);
    const config = {
      ...TOOLTIP_POSITION_CONFIG,
      positionPriorityByPosition: {
        ...TOOLTIP_POSITION_CONFIG.positionPriorityByPosition,
        bottom: ['bottom'] as const,
      },
      fallbackPosition,
      checkDocumentScroll: true,
    };

    expect(
      getDirection({ x: 450, y: 350, width: 100, height: 100 }, { width: 100, height: 500 }, 'bottom', config),
    ).toBe('bottom');
    expect(fallbackPosition).not.toHaveBeenCalled();
  });

  it('does not use document scroll space when the second pass is disabled', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000);
    const fallbackPosition = vi.fn(() => 'top' as const);
    const config = {
      ...TOOLTIP_POSITION_CONFIG,
      positionPriorityByPosition: {
        ...TOOLTIP_POSITION_CONFIG.positionPriorityByPosition,
        bottom: ['bottom'] as const,
      },
      fallbackPosition,
    };

    expect(
      getDirection({ x: 450, y: 350, width: 100, height: 100 }, { width: 100, height: 500 }, 'bottom', config),
    ).toBe('top');
    expect(fallbackPosition).toHaveBeenCalledWith('bottom');
  });

  it('accounts for the scrollbar size when calculating available viewport space', () => {
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 300);

    const anchorRect = { x: 450, y: 150, width: 100, height: 30 };
    const floatingRect = { width: 100, height: 110 };

    expect(getDirection(anchorRect, floatingRect)).toBe('bottom');
    vi.mocked(getScrollbarSize).mockReturnValue(16);
    expect(getDirection(anchorRect, floatingRect)).toBe('top');
  });
});
