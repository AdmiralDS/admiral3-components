import type { TooltipPosition } from './types';

/** отступ от вызвавшего элемента (anchorElement) */
const GAP = 8;

export type InternalTooltipPositionType =
  | TooltipPosition
  | 'bottomRight'
  | 'bottomLeft'
  | 'topRight'
  | 'topLeft'
  | 'leftBottom'
  | 'leftTop'
  | 'rightBottom'
  | 'rightTop'
  | 'bottomPageCenter'
  | 'topPageCenter';
export type CalculationResult = {
  check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => boolean;
};

// расположены в порядке приоритета при подборе стороны открытия тултипа
export function getTooltipDirection(
  anchorElement: HTMLElement,
  tooltipElement: HTMLElement,
  scrollbarSize: number,
  tooltipPosition?: TooltipPosition,
  fallbackPositions?: readonly TooltipPosition[],
): InternalTooltipPositionType {
  const anchorElementRect: DOMRect = anchorElement.getBoundingClientRect();
  const tooltipRect: DOMRect = tooltipElement.getBoundingClientRect();
  const positions = Object.entries(getPositionMapper(scrollbarSize)) as [
    InternalTooltipPositionType,
    CalculationResult,
  ][];

  const defaultPriority: TooltipPosition[] = ['bottom', 'top', 'left', 'right'];
  const requestedPriority = [tooltipPosition, ...(fallbackPositions ?? [])].filter(
    (position, index, list): position is TooltipPosition => Boolean(position) && list.indexOf(position) === index,
  );
  const priority = requestedPriority.length ? requestedPriority : defaultPriority;

  for (const requestedPosition of priority) {
    const compatiblePosition = positions.find(
      ([position, calculation]) =>
        position.startsWith(requestedPosition) && calculation.check(anchorElementRect, tooltipRect),
    );
    if (compatiblePosition) return compatiblePosition[0];
  }

  return priority[0];
}

function getPositionMapper(scrollbarSize: number): Record<InternalTooltipPositionType, CalculationResult> {
  return {
    bottom: {
      /** проверяем, что тултипу хватит места снизу и по ширине (если ширина тултипа больше
       * ширины вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
       * места слева и справа) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnBottom =
          globalThis.innerHeight - anchorElementRect.bottom - scrollbarSize > GAP + tooltipRect.height;
        const isEnoughOnLeft = anchorElementRect.left + anchorElementRect.width / 2 > tooltipRect.width / 2;
        const isEnoughOnRight =
          globalThis.innerWidth - anchorElementRect.right - scrollbarSize + anchorElementRect.width / 2 >
          tooltipRect.width / 2;
        return isEnoughOnBottom && isEnoughOnLeft && isEnoughOnRight;
      },
    },
    top: {
      /** проверяем, что тултипу хватит места сверху и по ширине (если ширина тултипа больше
       * ширины вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
       * места слева и справа) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnTop = anchorElementRect.top > GAP + tooltipRect.height;
        const isEnoughOnLeft = anchorElementRect.left + anchorElementRect.width / 2 > tooltipRect.width / 2;
        const isEnoughOnRight =
          globalThis.innerWidth - anchorElementRect.right - scrollbarSize + anchorElementRect.width / 2 >
          tooltipRect.width / 2;
        return isEnoughOnTop && isEnoughOnLeft && isEnoughOnRight;
      },
    },
    left: {
      /** проверяем, что тултипу хватит места слева и по высоте (если высота тултипа больше
       * высоты вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
       * места сверху и снизу) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnLeft = anchorElementRect.left > GAP + tooltipRect.width;
        const isEnoughOnTop = anchorElementRect.top > (tooltipRect.height - anchorElementRect.height) / 2;
        const isEnoughOnBottom =
          globalThis.innerHeight - anchorElementRect.bottom - scrollbarSize >
          (tooltipRect.height - anchorElementRect.height) / 2;
        return isEnoughOnLeft && isEnoughOnBottom && isEnoughOnTop;
      },
    },
    right: {
      /** проверяем, что тултипу хватит места справа и по высоте (если высота тултипа больше
       * высоты вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
       * места сверху и снизу) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnRight =
          globalThis.innerWidth - anchorElementRect.right - scrollbarSize > GAP + tooltipRect.width;
        const isEnoughOnTop = anchorElementRect.top > (tooltipRect.height - anchorElementRect.height) / 2;
        const isEnoughOnBottom =
          globalThis.innerHeight - anchorElementRect.bottom - scrollbarSize >
          (tooltipRect.height - anchorElementRect.height) / 2;
        return isEnoughOnRight && isEnoughOnBottom && isEnoughOnTop;
      },
    },
    bottomRight: {
      /** проверяем, что тултипу хватит места снизу и по ширине справа
       * (то есть тултип будет выровнен по левому краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnBottom =
          globalThis.innerHeight - anchorElementRect.bottom - scrollbarSize > GAP + tooltipRect.height;
        const isEnoughOnRight = globalThis.innerWidth - anchorElementRect.left - scrollbarSize > tooltipRect.width;
        return isEnoughOnBottom && isEnoughOnRight;
      },
    },
    bottomLeft: {
      /** проверяем, что тултипу хватит места снизу и по ширине слева
       * (то есть тултип будет выровнен по правому краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnBottom =
          globalThis.innerHeight - anchorElementRect.bottom - scrollbarSize > GAP + tooltipRect.height;
        const isEnoughOnLeft = anchorElementRect.right > tooltipRect.width;
        return isEnoughOnBottom && isEnoughOnLeft;
      },
    },
    topRight: {
      /** проверяем, что тултипу хватит места сверху и по ширине справа
       * (то есть тултип будет выровнен по левому краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnTop = anchorElementRect.top > GAP + tooltipRect.height;
        const isEnoughOnRight = globalThis.innerWidth - anchorElementRect.left - scrollbarSize > tooltipRect.width;
        return isEnoughOnTop && isEnoughOnRight;
      },
    },
    topLeft: {
      /** проверяем, что тултипу хватит места сверху и по ширине слева
       * (то есть тултип будет выровнен по правому краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnTop = anchorElementRect.top > GAP + tooltipRect.height;
        const isEnoughOnLeft = anchorElementRect.right > tooltipRect.width;
        return isEnoughOnTop && isEnoughOnLeft;
      },
    },
    leftBottom: {
      /** проверяем, что тултипу хватит места слева и по высоте снизу
       * (то есть тултип будет выровнен по верхнему краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnLeft = anchorElementRect.left > GAP + tooltipRect.width;
        const isEnoughOnBottom = globalThis.innerHeight - anchorElementRect.top - scrollbarSize > tooltipRect.height;
        return isEnoughOnLeft && isEnoughOnBottom;
      },
    },
    leftTop: {
      /** проверяем, что тултипу хватит места слева и по высоте сверху
       * (то есть тултип будет выровнен по нижнему краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnLeft = anchorElementRect.left > GAP + tooltipRect.width;
        const isEnoughOnTop = anchorElementRect.bottom > tooltipRect.height;
        return isEnoughOnLeft && isEnoughOnTop;
      },
    },
    rightBottom: {
      /** проверяем, что тултипу хватит места справа и по высоте снизу
       * (то есть тултип будет выровнен по верхнему краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnRight =
          globalThis.innerWidth - anchorElementRect.right - scrollbarSize > GAP + tooltipRect.width;
        const isEnoughOnBottom = globalThis.innerHeight - anchorElementRect.top - scrollbarSize > tooltipRect.height;
        return isEnoughOnRight && isEnoughOnBottom;
      },
    },
    rightTop: {
      /** проверяем, что тултипу хватит места справа и по высоте сверху
       * (то есть тултип будет выровнен по нижнему краю вызвавшего элемента (anchorElement)) */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnRight =
          globalThis.innerWidth - anchorElementRect.right - scrollbarSize > GAP + tooltipRect.width;
        const isEnoughOnTop = anchorElementRect.bottom > tooltipRect.height;
        return isEnoughOnRight && isEnoughOnTop;
      },
    },
    bottomPageCenter: {
      /** проверяем, что тултипу хватит места снизу и по центру */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnBottom =
          globalThis.innerHeight - anchorElementRect.bottom - scrollbarSize > GAP + tooltipRect.height;
        const isEnoughOnCenter = globalThis.innerWidth - scrollbarSize >= tooltipRect.width;
        return isEnoughOnBottom && isEnoughOnCenter;
      },
    },
    topPageCenter: {
      /** проверяем, что тултипу хватит места сверху и по центру */
      check: (anchorElementRect: DOMRect, tooltipRect: DOMRect) => {
        const isEnoughOnTop = anchorElementRect.top > GAP + tooltipRect.height;
        const isEnoughOnCenter = globalThis.innerWidth - scrollbarSize >= tooltipRect.width;
        return isEnoughOnTop && isEnoughOnCenter;
      },
    },
  };
}
