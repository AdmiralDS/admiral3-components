import { COMPATIBLE_POSITIONS, DEFAULT_TOOLTIP_POSITION, POSITION_PRIORITY } from './constants';
import type { PositionCheck, PositionContext, TooltipInternalPosition, TooltipPosition } from './types';

export function getTooltipDirection(
  anchorElement: HTMLElement,
  tooltipElement: HTMLElement,
  scrollbarSize: number,
  tooltipPosition?: TooltipPosition,
): TooltipInternalPosition {
  const anchorElementRect: DOMRect = anchorElement.getBoundingClientRect();
  const tooltipRect: DOMRect = tooltipElement.getBoundingClientRect();

  const positionContext: PositionContext = {
    spaceTop: anchorElementRect.top,
    spaceRight: globalThis.innerWidth - anchorElementRect.right - scrollbarSize,
    spaceBottom: globalThis.innerHeight - anchorElementRect.bottom - scrollbarSize,
    spaceLeft: anchorElementRect.left,
    viewportWidth: globalThis.innerWidth - scrollbarSize,
    anchorWidth: anchorElementRect.width,
    anchorHeight: anchorElementRect.height,
    tooltipWidth: tooltipRect.width,
    tooltipHeight: tooltipRect.height,
  };
  /** Если задан параметр tooltipPosition, то тултип обязательно должен отрендериться в указанном направлении
   * (с возможностью сдвига по горизонтальной оси при tooltipPosition === 'top' | 'bottom',
   * и по вертикальной оси при tooltipPosition = 'right' | 'left').
   */
  const compatiblePosition = POSITION_PRIORITY.find((position) => {
    const isCompatible = !tooltipPosition || COMPATIBLE_POSITIONS[tooltipPosition].includes(position);
    return isCompatible && POSITION_CHECKS[position](positionContext);
  });

  const fallbackPosition = tooltipPosition ?? DEFAULT_TOOLTIP_POSITION;
  return compatiblePosition ?? fallbackPosition;
}

const POSITION_CHECKS = {
  bottom:
    /** проверяем, что тултипу хватит места снизу и по ширине (если ширина тултипа больше
     * ширины вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
     * места слева и справа) */
    ({ spaceBottom, spaceLeft, spaceRight, anchorWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnBottom = spaceBottom > tooltipHeight;
      const isEnoughOnLeft = spaceLeft + anchorWidth / 2 > tooltipWidth / 2;
      const isEnoughOnRight = spaceRight + anchorWidth / 2 > tooltipWidth / 2;
      return isEnoughOnBottom && isEnoughOnLeft && isEnoughOnRight;
    },
  top:
    /** проверяем, что тултипу хватит места сверху и по ширине (если ширина тултипа больше
     * ширины вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
     * места слева и справа) */
    ({ spaceTop, spaceLeft, spaceRight, anchorWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnTop = spaceTop > tooltipHeight;
      const isEnoughOnLeft = spaceLeft + anchorWidth / 2 > tooltipWidth / 2;
      const isEnoughOnRight = spaceRight + anchorWidth / 2 > tooltipWidth / 2;
      return isEnoughOnTop && isEnoughOnLeft && isEnoughOnRight;
    },
  left:
    /** проверяем, что тултипу хватит места слева и по высоте (если высота тултипа больше
     * высоты вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
     * места сверху и снизу) */
    ({ spaceTop, spaceBottom, spaceLeft, anchorHeight, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnLeft = spaceLeft > tooltipWidth;
      const isEnoughOnTop = spaceTop > (tooltipHeight - anchorHeight) / 2;
      const isEnoughOnBottom = spaceBottom > (tooltipHeight - anchorHeight) / 2;
      return isEnoughOnLeft && isEnoughOnBottom && isEnoughOnTop;
    },
  right:
    /** проверяем, что тултипу хватит места справа и по высоте (если высота тултипа больше
     * высоты вызвавшего элемента (anchorElement), то нужно убедиться, что тултипу хватит
     * места сверху и снизу) */
    ({ spaceTop, spaceRight, spaceBottom, anchorHeight, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnRight = spaceRight > tooltipWidth;
      const isEnoughOnTop = spaceTop > (tooltipHeight - anchorHeight) / 2;
      const isEnoughOnBottom = spaceBottom > (tooltipHeight - anchorHeight) / 2;
      return isEnoughOnRight && isEnoughOnBottom && isEnoughOnTop;
    },
  bottomRight:
    /** проверяем, что тултипу хватит места снизу и по ширине справа
     * (то есть тултип будет выровнен по левому краю вызвавшего элемента (anchorElement)) */
    ({ spaceBottom, spaceRight, anchorWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnBottom = spaceBottom > tooltipHeight;
      const isEnoughOnRight = spaceRight + anchorWidth > tooltipWidth;
      return isEnoughOnBottom && isEnoughOnRight;
    },
  bottomLeft:
    /** проверяем, что тултипу хватит места снизу и по ширине слева
     * (то есть тултип будет выровнен по правому краю вызвавшего элемента (anchorElement)) */
    ({ spaceBottom, spaceLeft, anchorWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnBottom = spaceBottom > tooltipHeight;
      const isEnoughOnLeft = spaceLeft + anchorWidth > tooltipWidth;
      return isEnoughOnBottom && isEnoughOnLeft;
    },
  topRight:
    /** проверяем, что тултипу хватит места сверху и по ширине справа
     * (то есть тултип будет выровнен по левому краю вызвавшего элемента (anchorElement)) */
    ({ spaceTop, spaceRight, anchorWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnTop = spaceTop > tooltipHeight;
      const isEnoughOnRight = spaceRight + anchorWidth > tooltipWidth;
      return isEnoughOnTop && isEnoughOnRight;
    },
  topLeft:
    /** проверяем, что тултипу хватит места сверху и по ширине слева
     * (то есть тултип будет выровнен по правому краю вызвавшего элемента (anchorElement)) */
    ({ spaceTop, spaceLeft, anchorWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnTop = spaceTop > tooltipHeight;
      const isEnoughOnLeft = spaceLeft + anchorWidth > tooltipWidth;
      return isEnoughOnTop && isEnoughOnLeft;
    },
  leftBottom:
    /** проверяем, что тултипу хватит места слева и по высоте снизу
     * (то есть тултип будет выровнен по верхнему краю вызвавшего элемента (anchorElement)) */
    ({ spaceBottom, spaceLeft, anchorHeight, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnLeft = spaceLeft > tooltipWidth;
      const isEnoughOnBottom = spaceBottom + anchorHeight > tooltipHeight;
      return isEnoughOnLeft && isEnoughOnBottom;
    },
  leftTop:
    /** проверяем, что тултипу хватит места слева и по высоте сверху
     * (то есть тултип будет выровнен по нижнему краю вызвавшего элемента (anchorElement)) */
    ({ spaceTop, spaceLeft, anchorHeight, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnLeft = spaceLeft > tooltipWidth;
      const isEnoughOnTop = spaceTop + anchorHeight > tooltipHeight;
      return isEnoughOnLeft && isEnoughOnTop;
    },
  rightBottom:
    /** проверяем, что тултипу хватит места справа и по высоте снизу
     * (то есть тултип будет выровнен по верхнему краю вызвавшего элемента (anchorElement)) */
    ({ spaceRight, spaceBottom, anchorHeight, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnRight = spaceRight > tooltipWidth;
      const isEnoughOnBottom = spaceBottom + anchorHeight > tooltipHeight;
      return isEnoughOnRight && isEnoughOnBottom;
    },
  rightTop:
    /** проверяем, что тултипу хватит места справа и по высоте сверху
     * (то есть тултип будет выровнен по нижнему краю вызвавшего элемента (anchorElement)) */
    ({ spaceTop, spaceRight, anchorHeight, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnRight = spaceRight > tooltipWidth;
      const isEnoughOnTop = spaceTop + anchorHeight > tooltipHeight;
      return isEnoughOnRight && isEnoughOnTop;
    },
  bottomPageCenter:
    /** проверяем, что тултипу хватит места снизу и по центру */
    ({ spaceBottom, viewportWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnBottom = spaceBottom > tooltipHeight;
      const isEnoughOnCenter = viewportWidth > tooltipWidth;
      return isEnoughOnBottom && isEnoughOnCenter;
    },
  topPageCenter:
    /** проверяем, что тултипу хватит места сверху и по центру */
    ({ spaceTop, viewportWidth, tooltipWidth, tooltipHeight }) => {
      const isEnoughOnTop = spaceTop > tooltipHeight;
      const isEnoughOnCenter = viewportWidth > tooltipWidth;
      return isEnoughOnTop && isEnoughOnCenter;
    },
} satisfies Record<TooltipInternalPosition, PositionCheck>;
