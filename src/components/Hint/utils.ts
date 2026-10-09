import { HINT_MOBILE_BREAKPOINT } from './constants';
import type { FloatingInternalPosition } from '../_internal/FloatingPortal';

/** На мобильном экране Hint располагается только сверху или снизу относительно anchor-элемента. */
export const getMobileHintDirection = (
  anchorElement: Element,
  anchorRect: DOMRect,
  hintElement: Element,
): FloatingInternalPosition | null => {
  const targetWindow = anchorElement.ownerDocument.defaultView;
  if (!targetWindow || targetWindow.innerWidth >= HINT_MOBILE_BREAKPOINT) return null;

  const hintRect = hintElement.getBoundingClientRect();
  return targetWindow.innerHeight - anchorRect.bottom > hintRect.height ? 'bottomPageCenter' : 'topPageCenter';
};

/** Растягивает портал на ширину viewport для центрирования Hint относительно страницы. */
export const stretchToViewportWidth = (floatingPortal: HTMLElement) => {
  floatingPortal.style.left = '0px';
  floatingPortal.style.width = '100%';
};
