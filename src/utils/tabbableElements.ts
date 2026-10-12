/**
 * Селектор нативно интерактивных элементов и элементов, явно добавленных в tab-последовательность.
 * Он намеренно не включает элементы с `tabindex="-1"`: они доступны через `focus()`, но не через Tab.
 */
const TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Проверяет вычисленный tabIndex и состояния, исключающие элемент вместе с его поддеревом из навигации. */
const isTabbable = (element: HTMLElement) =>
  element.tabIndex >= 0 && !element.hidden && !element.closest('[hidden], [inert]');

/**
 * Возвращает элементы контейнера, доступные последовательной клавиатурной навигации через Tab.
 * В отличие от всех программно focusable-элементов результат не содержит элементы с отрицательным tabIndex.
 */
export const getTabbableElements = (container: ParentNode): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(isTabbable);

/** Возвращает следующий tabbable-элемент документа в DOM-порядке относительно переданного элемента. */
export const getNextTabbableElement = (element: HTMLElement): HTMLElement | undefined => {
  const tabbableElements = getTabbableElements(element.ownerDocument);
  const elementIndex = tabbableElements.indexOf(element);

  return elementIndex < 0 ? undefined : tabbableElements[elementIndex + 1];
};
