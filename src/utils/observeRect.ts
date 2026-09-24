const RECT_KEYS = [
  'bottom',
  'height',
  'left',
  'right',
  'top',
  'width',
  'x',
  'y',
  'scrollHeight',
  'scrollLeft',
  'scrollTop',
  'scrollWidth',
] as const;

type RectKey = (typeof RECT_KEYS)[number];

export type Rect = Readonly<Record<RectKey, number>>;

export type RectObserver = {
  observe: () => void;
  unobserve: () => void;
};

const readRect = (node: Element): Rect => {
  const { bottom, height, left, right, top, width, x, y } = node.getBoundingClientRect();
  const { scrollHeight, scrollLeft, scrollTop, scrollWidth } = node;

  return {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x,
    y,
    scrollHeight,
    scrollLeft,
    scrollTop,
    scrollWidth,
  };
};

const rectChanged = (previousRect: Rect | undefined, nextRect: Rect) =>
  !previousRect || RECT_KEYS.some((key) => previousRect[key] !== nextRect[key]);

/**
 * Observes the element's geometry using requestAnimationFrame.
 *
 * observe() and unobserve() are idempotent.
 * The callback may call unobserve() synchronously; in that case, the next
 * frame will not be scheduled.
 *
 * Use inside useEffect or useLayoutEffect, and always call unobserve()
 * during cleanup.
 */
export function observeRect(node: Element, callback: (rect: Rect) => void): RectObserver {
  // ID of the requested RAF callback that has not run yet
  let animationFrameId: number | undefined;
  // Last measured Rect passed to the callback
  let previousRect: Rect | undefined;
  // Indicates whether observation should continue
  let isObserving = false;

  const requestNextFrame = () => {
    if (animationFrameId === undefined) {
      animationFrameId = requestAnimationFrame(checkRect);
    }
  };

  const checkRect = () => {
    animationFrameId = undefined;

    if (!isObserving) return;

    const nextRect = readRect(node);

    if (rectChanged(previousRect, nextRect)) {
      previousRect = nextRect;
      callback(nextRect);
    }

    if (isObserving) requestNextFrame();
  };

  return {
    observe() {
      if (isObserving) return;

      isObserving = true;
      previousRect = undefined;
      requestNextFrame();
    },

    unobserve() {
      isObserving = false;

      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
    },
  };
}
