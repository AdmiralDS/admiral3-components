const OVERLAY_SCROLLBAR_SIZE = 16;

/**
 * Returns the visual width of a vertical scrollbar.
 *
 * Browsers do not expose the visual width of an overlay scrollbar. When the
 * measured scrollbar does not occupy layout space, the macOS default of 16px
 * is returned so positioned content does not overlap a scrollbar that appears
 * only while scrolling.
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
