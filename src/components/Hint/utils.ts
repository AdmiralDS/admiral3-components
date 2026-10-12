import { HINT_MOBILE_BREAKPOINT, HINT_OFFSET } from './constants';
import type { HintTooltipInternalPosition } from '../_internal/FloatingPortal';

/** На мобильном экране Hint располагается только сверху или снизу относительно anchor-элемента. */
export const getMobileHintDirection = (
  anchorElement: Element,
  anchorRect: DOMRect,
  hintElement: Element,
): HintTooltipInternalPosition | null => {
  const targetWindow = anchorElement.ownerDocument.defaultView;
  if (!targetWindow || targetWindow.innerWidth >= HINT_MOBILE_BREAKPOINT) return null;

  const hintRect = hintElement.getBoundingClientRect();
  return targetWindow.innerHeight - anchorRect.bottom > hintRect.height + HINT_OFFSET
    ? 'bottomPageCenter'
    : 'topPageCenter';
};

/** Растягивает портал на ширину viewport для центрирования Hint относительно страницы. */
export const stretchToViewportWidth = (floatingPortal: HTMLElement) => {
  floatingPortal.style.left = '0px';
  floatingPortal.style.width = '100%';
};
