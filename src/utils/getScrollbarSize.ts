const OVERLAY_SCROLLBAR_SIZE = 16;

/**
 * Returns the scrollbar size used to reserve viewport space along both positioning axes.
 *
 * Vertical and horizontal scrollbars normally have the same thickness. Browsers do not expose
 * the visual size of an overlay scrollbar, so when the measured scrollbar does not occupy layout
 * space, the macOS default of 16px is returned. This prevents positioned content from overlapping
 * a scrollbar that appears only while scrolling.
 */
export function getScrollbarSize(targetDocument: Document = document): number {
  const scrollbox = targetDocument.createElement('div');

  Object.assign(scrollbox.style, {
    height: '100px',
    overflow: 'scroll',
    position: 'absolute',
    top: '-9999px',
    visibility: 'hidden',
    width: '100px',
  });

  targetDocument.body.appendChild(scrollbox);
  const scrollbarSize = scrollbox.offsetWidth - scrollbox.clientWidth;
  scrollbox.remove();

  return scrollbarSize > 0 ? scrollbarSize : OVERLAY_SCROLLBAR_SIZE;
}
