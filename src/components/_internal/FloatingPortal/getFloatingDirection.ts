import { getScrollbarSize } from '../../../utils/getScrollbarSize';

export const FLOATING_POSITIONS = ['bottom', 'top', 'left', 'right'] as const;
export const FLOATING_INTERNAL_POSITIONS = [
  ...FLOATING_POSITIONS,
  'bottomRight',
  'bottomLeft',
  'topRight',
  'topLeft',
  'leftBottom',
  'leftTop',
  'rightBottom',
  'rightTop',
  'bottomPageCenter',
  'topPageCenter',
] as const;

export type FloatingPosition = (typeof FLOATING_POSITIONS)[number];
export type FloatingInternalPosition = (typeof FLOATING_INTERNAL_POSITIONS)[number];

type PositionContext = {
  spaceTop: number;
  spaceRight: number;
  spaceBottom: number;
  spaceLeft: number;
  viewportWidth: number;
  anchorWidth: number;
  anchorHeight: number;
  floatingWidth: number;
  floatingHeight: number;
  offset: number;
};

type PositionCheck = (context: PositionContext) => boolean;

export type FloatingPositionConfig = {
  /** Порядок проверки позиций, когда предпочтительная сторона не задана. */
  positionPriority: readonly FloatingInternalPosition[];
  /** Порядок проверки позиций при явно заданной предпочтительной стороне. */
  positionPriorityByPosition: Record<FloatingPosition, readonly FloatingInternalPosition[]>;
  /** Позиция, используемая, если ни одна из проверяемых позиций не подошла. */
  fallbackPosition: (position?: FloatingPosition) => FloatingInternalPosition;
  /** Расстояние между якорем и floating-элементом. */
  offset: number;
};

export function getFloatingDirection(
  anchorElement: Element,
  anchorElementRect: DOMRect,
  floatingElement: Element,
  position: FloatingPosition | undefined,
  config: FloatingPositionConfig,
): FloatingInternalPosition {
  const floatingRect = floatingElement.getBoundingClientRect();
  const targetDocument = anchorElement.ownerDocument;
  const scrollbarSize = getScrollbarSize(targetDocument);
  const targetWindow = targetDocument.defaultView;
  const viewportWidth = targetWindow?.innerWidth ?? 0;
  const viewportHeight = targetWindow?.innerHeight ?? 0;

  const positionContext: PositionContext = {
    spaceTop: anchorElementRect.top,
    spaceRight: viewportWidth - anchorElementRect.right - scrollbarSize,
    spaceBottom: viewportHeight - anchorElementRect.bottom - scrollbarSize,
    spaceLeft: anchorElementRect.left,
    viewportWidth: viewportWidth - scrollbarSize,
    anchorWidth: anchorElementRect.width,
    anchorHeight: anchorElementRect.height,
    floatingWidth: floatingRect.width,
    floatingHeight: floatingRect.height,
    offset: config.offset,
  };
  const positionPriority = position ? config.positionPriorityByPosition[position] : config.positionPriority;
  const compatiblePosition = positionPriority.find((candidate) => POSITION_CHECKS[candidate](positionContext));

  return compatiblePosition ?? config.fallbackPosition(position);
}

const POSITION_CHECKS = {
  /** Проверяем, что floating-элементу хватит места снизу и по ширине. Если ширина floating-элемента
   * больше ширины anchor-элемента, дополнительно убеждаемся, что ему хватит места слева и справа. */
  bottom: ({ spaceBottom, spaceLeft, spaceRight, anchorWidth, floatingWidth, floatingHeight, offset }) =>
    spaceBottom > floatingHeight + offset &&
    spaceLeft + anchorWidth / 2 > floatingWidth / 2 &&
    spaceRight + anchorWidth / 2 > floatingWidth / 2,
  /** Проверяем, что floating-элементу хватит места сверху и по ширине. Если ширина floating-элемента
   * больше ширины anchor-элемента, дополнительно убеждаемся, что ему хватит места слева и справа. */
  top: ({ spaceTop, spaceLeft, spaceRight, anchorWidth, floatingWidth, floatingHeight, offset }) =>
    spaceTop > floatingHeight + offset &&
    spaceLeft + anchorWidth / 2 > floatingWidth / 2 &&
    spaceRight + anchorWidth / 2 > floatingWidth / 2,
  /** Проверяем, что floating-элементу хватит места слева и по высоте. Если высота floating-элемента
   * больше высоты anchor-элемента, дополнительно убеждаемся, что ему хватит места сверху и снизу. */
  left: ({ spaceTop, spaceBottom, spaceLeft, anchorHeight, floatingWidth, floatingHeight, offset }) =>
    spaceLeft > floatingWidth + offset &&
    spaceTop > (floatingHeight - anchorHeight) / 2 &&
    spaceBottom > (floatingHeight - anchorHeight) / 2,
  /** Проверяем, что floating-элементу хватит места справа и по высоте. Если высота floating-элемента
   * больше высоты anchor-элемента, дополнительно убеждаемся, что ему хватит места сверху и снизу. */
  right: ({ spaceTop, spaceRight, spaceBottom, anchorHeight, floatingWidth, floatingHeight, offset }) =>
    spaceRight > floatingWidth + offset &&
    spaceTop > (floatingHeight - anchorHeight) / 2 &&
    spaceBottom > (floatingHeight - anchorHeight) / 2,
  /** Проверяем, что floating-элементу хватит места снизу и по ширине справа,
   * то есть при выравнивании по левому краю anchor-элемента. */
  bottomRight: ({ spaceBottom, spaceRight, anchorWidth, floatingWidth, floatingHeight, offset }) =>
    spaceBottom > floatingHeight + offset && spaceRight + anchorWidth > floatingWidth,
  /** Проверяем, что floating-элементу хватит места снизу и по ширине слева,
   * то есть при выравнивании по правому краю anchor-элемента. */
  bottomLeft: ({ spaceBottom, spaceLeft, anchorWidth, floatingWidth, floatingHeight, offset }) =>
    spaceBottom > floatingHeight + offset && spaceLeft + anchorWidth > floatingWidth,
  /** Проверяем, что floating-элементу хватит места сверху и по ширине справа,
   * то есть при выравнивании по левому краю anchor-элемента. */
  topRight: ({ spaceTop, spaceRight, anchorWidth, floatingWidth, floatingHeight, offset }) =>
    spaceTop > floatingHeight + offset && spaceRight + anchorWidth > floatingWidth,
  /** Проверяем, что floating-элементу хватит места сверху и по ширине слева,
   * то есть при выравнивании по правому краю anchor-элемента. */
  topLeft: ({ spaceTop, spaceLeft, anchorWidth, floatingWidth, floatingHeight, offset }) =>
    spaceTop > floatingHeight + offset && spaceLeft + anchorWidth > floatingWidth,
  /** Проверяем, что floating-элементу хватит места слева и по высоте снизу,
   * то есть при выравнивании по верхнему краю anchor-элемента. */
  leftBottom: ({ spaceBottom, spaceLeft, anchorHeight, floatingWidth, floatingHeight, offset }) =>
    spaceLeft > floatingWidth + offset && spaceBottom + anchorHeight > floatingHeight,
  /** Проверяем, что floating-элементу хватит места слева и по высоте сверху,
   * то есть при выравнивании по нижнему краю anchor-элемента. */
  leftTop: ({ spaceTop, spaceLeft, anchorHeight, floatingWidth, floatingHeight, offset }) =>
    spaceLeft > floatingWidth + offset && spaceTop + anchorHeight > floatingHeight,
  /** Проверяем, что floating-элементу хватит места справа и по высоте снизу,
   * то есть при выравнивании по верхнему краю anchor-элемента. */
  rightBottom: ({ spaceRight, spaceBottom, anchorHeight, floatingWidth, floatingHeight, offset }) =>
    spaceRight > floatingWidth + offset && spaceBottom + anchorHeight > floatingHeight,
  /** Проверяем, что floating-элементу хватит места справа и по высоте сверху,
   * то есть при выравнивании по нижнему краю anchor-элемента. */
  rightTop: ({ spaceTop, spaceRight, anchorHeight, floatingWidth, floatingHeight, offset }) =>
    spaceRight > floatingWidth + offset && spaceTop + anchorHeight > floatingHeight,
  /** Проверяем, что floating-элементу хватит места снизу и по ширине viewport
   * при горизонтальном центрировании относительно страницы. */
  bottomPageCenter: ({ spaceBottom, viewportWidth, floatingWidth, floatingHeight, offset }) =>
    spaceBottom > floatingHeight + offset && viewportWidth > floatingWidth,
  /** Проверяем, что floating-элементу хватит места сверху и по ширине viewport
   * при горизонтальном центрировании относительно страницы. */
  topPageCenter: ({ spaceTop, viewportWidth, floatingWidth, floatingHeight, offset }) =>
    spaceTop > floatingHeight + offset && viewportWidth > floatingWidth,
} satisfies Record<FloatingInternalPosition, PositionCheck>;
