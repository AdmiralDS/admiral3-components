/** Checks whether an element's content exceeds its visible area in either direction. */
export function isOverflowed(element: HTMLElement | null): boolean {
  if (!element) return false;

  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}
