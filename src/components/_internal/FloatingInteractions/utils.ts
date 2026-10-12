export const isElementInside = (container: Element | null, element: EventTarget | null) =>
  Boolean(container && element && 'nodeType' in element && container.contains(element as Node));
