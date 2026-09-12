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
 * Наблюдает за геометрией элемента через requestAnimationFrame.
 *
 * observe() и unobserve() идемпотентны.
 * Callback может синхронно вызвать unobserve(); в этом случае следующий
 * кадр не будет запланирован.
 *
 * Использовать внутри useEffect или useLayoutEffect и обязательно
 * вызывать unobserve() в cleanup.
 */
export function observeRect(node: Element, callback: (rect: Rect) => void): RectObserver {
  // идентификатор уже запрошенного, но ещё не выполненного RAF
  let animationFrameId: number | undefined;
  // последний измеренный Rect, переданный в callback
  let previousRect: Rect | undefined;
  // логический признак того, должно ли наблюдение продолжаться
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
