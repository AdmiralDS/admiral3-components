import { DROPDOWN_OFFSET, DROPDOWN_VIEWPORT_MARGIN } from './constants';
import type { DropdownAlignment, DropdownLayout, DropdownPosition } from './types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface PositionCandidate<T> {
  value: T;
  shift: number;
}

/** Возвращает минимальный сдвиг, который удерживает floating-элемент в пределах viewport. */
const getShift = (naturalCoordinate: number, floatingSize: number, viewportSize: number) => {
  const minCoordinate = DROPDOWN_VIEWPORT_MARGIN;
  const maxCoordinate = viewportSize - DROPDOWN_VIEWPORT_MARGIN - floatingSize;
  const correctedCoordinate =
    minCoordinate <= maxCoordinate
      ? clamp(naturalCoordinate, minCoordinate, maxCoordinate)
      : clamp(naturalCoordinate, maxCoordinate, minCoordinate);

  return correctedCoordinate - naturalCoordinate;
};

/** Выбирает приоритетный вариант, если он помещается или требует не большего сдвига, чем fallback. */
const chooseCandidate = <T>(preferred: PositionCandidate<T>, fallback: PositionCandidate<T>): PositionCandidate<T> => {
  const preferredFits = preferred.shift === 0;
  const fallbackFits = fallback.shift === 0;

  if (preferredFits || (!fallbackFits && Math.abs(preferred.shift) <= Math.abs(fallback.shift))) return preferred;
  return fallback;
};

/** Выбирает bottom или top с приоритетом bottom и сравнением вертикального shift при нехватке места. */
const resolveVerticalPosition = (
  targetRect: DOMRect,
  dropdownHeight: number,
  viewportHeight: number,
): PositionCandidate<DropdownPosition> => {
  const naturalBottomTop = targetRect.bottom + DROPDOWN_OFFSET;
  const naturalTopTop = targetRect.top - DROPDOWN_OFFSET - dropdownHeight;

  return chooseCandidate(
    { value: 'bottom', shift: getShift(naturalBottomTop, dropdownHeight, viewportHeight) },
    { value: 'top', shift: getShift(naturalTopTop, dropdownHeight, viewportHeight) },
  );
};

const getNaturalLeft = (align: Exclude<DropdownAlignment, 'auto'>, targetRect: DOMRect, dropdownWidth: number) =>
  align === 'start'
    ? targetRect.left
    : align === 'center'
      ? targetRect.left + (targetRect.width - dropdownWidth) / 2
      : targetRect.right - dropdownWidth;

/** В auto выбирает между start и end; явное выравнивание сохраняет и только корректирует сдвигом. */
const resolveHorizontalAlignment = (
  align: DropdownAlignment,
  targetRect: DOMRect,
  dropdownWidth: number,
  viewportWidth: number,
): PositionCandidate<Exclude<DropdownAlignment, 'auto'>> => {
  const createCandidate = (value: Exclude<DropdownAlignment, 'auto'>) => {
    const naturalLeft = getNaturalLeft(value, targetRect, dropdownWidth);
    return { value, shift: getShift(naturalLeft, dropdownWidth, viewportWidth) };
  };

  if (align !== 'auto') return createCandidate(align);
  return chooseCandidate(createCandidate('start'), createCandidate('end'));
};

/** Target считается detached, только когда полностью перестаёт пересекаться с viewport. */
const isTargetDetached = (targetRect: DOMRect, viewportWidth: number, viewportHeight: number) =>
  targetRect.right <= 0 ||
  targetRect.left >= viewportWidth ||
  targetRect.bottom <= 0 ||
  targetRect.top >= viewportHeight;

export const getDropdownLayout = (
  align: DropdownAlignment,
  targetRect: DOMRect,
  dropdownRect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
): DropdownLayout => {
  const vertical = resolveVerticalPosition(targetRect, dropdownRect.height, viewportHeight);
  const horizontal = resolveHorizontalAlignment(align, targetRect, dropdownRect.width, viewportWidth);

  return {
    position: vertical.value,
    alignSelf: horizontal.value === 'start' ? 'flex-start' : horizontal.value === 'center' ? 'center' : 'flex-end',
    translateX: horizontal.shift,
    translateY: vertical.shift,
    targetDetached: isTargetDetached(targetRect, viewportWidth, viewportHeight),
  };
};
