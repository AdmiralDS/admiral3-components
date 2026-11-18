/** Проверяет переполнение. Допуск по высоте не влияет на строгое сравнение ширины. */
export function isOverflowed(element: HTMLElement | null, verticalTolerance = 0): boolean {
  if (!element) return false;

  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight + verticalTolerance;
}
