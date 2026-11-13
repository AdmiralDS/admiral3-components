/**
 * Селектор нативно интерактивных элементов и элементов с явно заданным `tabindex`.
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
  '[tabindex]',
].join(',');

/** Проверяет CSS-состояния, исключающие элемент или его предка из последовательной навигации. */
const isVisible = (element: HTMLElement) => {
  const ownerWindow = element.ownerDocument.defaultView;
  if (!ownerWindow) return true;
  const elementStyle = ownerWindow.getComputedStyle(element);

  if (elementStyle.visibility === 'hidden' || elementStyle.visibility === 'collapse') return false;

  let current: HTMLElement | null = element;

  while (current) {
    if (ownerWindow.getComputedStyle(current).display === 'none') return false;
    current = current.parentElement;
  }

  return true;
};

/** Проверяет вычисленный tabIndex и состояния, исключающие элемент вместе с его поддеревом из навигации. */
const isTabbable = (element: HTMLElement) =>
  element.tabIndex >= 0 &&
  !element.hidden &&
  !element.matches(':disabled') &&
  !element.closest('[hidden], [inert]') &&
  isVisible(element);

/**
 * Возвращает элементы контейнера, доступные последовательной клавиатурной навигации через Tab.
 * В отличие от всех программно focusable-элементов результат не содержит элементы с отрицательным tabIndex.
 *
 * Утилита покрывает потребности внутренних floating-компонентов: стандартные интерактивные HTML-элементы,
 * `tabindex`, `disabled`, `hidden`, `inert`, `display: none` и `visibility: hidden/collapse`, включая состояния
 * предков. Она не является полной реализацией браузерного sequential focus navigation и не учитывает, например,
 * Shadow DOM, порядок положительных `tabindex`, особенности radio-групп и закрытого `details`. Если такие сценарии
 * понадобятся компонентам библиотеки, следует рассмотреть переход на специализированную библиотеку `tabbable`.
 *
 * @param container Узел, среди потомков которого выполняется поиск.
 * @returns Доступные через Tab HTML-элементы в DOM-порядке.
 */
export const getTabbableElements = (container: ParentNode): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(isTabbable);

/**
 * Возвращает следующий tabbable-элемент документа в DOM-порядке относительно переданного элемента.
 *
 * @param element Элемент, относительно которого ищется следующий участник Tab-последовательности.
 * @param excludedSubtree Необязательный корень поддерева, элементы которого исключаются из поиска.
 * @returns Следующий доступный через Tab элемент либо `undefined`, если такого элемента нет.
 */
export const getNextTabbableElement = (
  element: HTMLElement,
  excludedSubtree?: Element | null,
): HTMLElement | undefined => {
  const tabbableElements = getTabbableElements(element.ownerDocument).filter(
    (candidate) => !excludedSubtree?.contains(candidate),
  );
  const elementIndex = tabbableElements.indexOf(element);

  return elementIndex < 0 ? undefined : tabbableElements[elementIndex + 1];
};
