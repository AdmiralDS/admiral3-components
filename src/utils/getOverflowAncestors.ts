const isOverflowElement = (element: Element, win: Window) => {
  const { overflow, overflowX, overflowY } = win.getComputedStyle(element);
  return /(auto|scroll|overlay|hidden|clip)/.test(`${overflow}${overflowX}${overflowY}`);
};

/**
 * Возвращает предков элемента, чьи scroll или resize могут повлиять на его положение
 * относительно viewport. В список входят DOM-элементы с ограничивающим overflow
 * и `window`, который всегда добавляется последним.
 */
export const getOverflowAncestors = (element: Element): Array<Element | Window> => {
  const win = element.ownerDocument.defaultView;
  if (!win) return [];

  const ancestors: Array<Element | Window> = [];
  let parent = element.parentElement;

  while (parent) {
    if (isOverflowElement(parent, win)) ancestors.push(parent);
    parent = parent.parentElement;
  }

  ancestors.push(win);
  return ancestors;
};
