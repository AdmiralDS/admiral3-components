import { useEffect, useLayoutEffect, useState } from 'react';

import { isOverflowed } from '#src/utils/isOverflowed';

interface OverflowOptions {
  /** Следить за размерами, шрифтами и изменениями содержимого при рендере. */
  observe?: boolean;
  /** Повторное измерение при изменении текста или настроек обрезания без изменения размеров. */
  measurementKey?: string | number;
  /** Допуск по высоте для метрик текста. По умолчанию 0; ширина проверяется строго. */
  verticalTolerance?: number;
}

export const useOverflow = (
  targetElement: Element | null,
  contentElement: HTMLElement | null,
  { observe = false, measurementKey, verticalTolerance = 0 }: OverflowOptions = {},
) => {
  const [hasOverflow, setHasOverflow] = useState(false);

  useLayoutEffect(() => {
    if (!observe) return;
    let disposed = false;
    const measure = () => {
      if (!disposed) setHasOverflow(isOverflowed(contentElement, verticalTolerance));
    };
    measure();
    if (!contentElement) return;
    const ownerWindow = contentElement.ownerDocument.defaultView;
    const observer = ownerWindow?.ResizeObserver ? new ownerWindow.ResizeObserver(measure) : undefined;
    observer?.observe(contentElement);
    const fonts = contentElement.ownerDocument.fonts;
    void fonts?.ready.then(measure);
    fonts?.addEventListener('loadingdone', measure);
    ownerWindow?.addEventListener('resize', measure);
    return () => {
      disposed = true;
      observer?.disconnect();
      fonts?.removeEventListener('loadingdone', measure);
      ownerWindow?.removeEventListener('resize', measure);
    };
  }, [contentElement, observe, measurementKey, verticalTolerance]);

  useEffect(() => {
    if (!targetElement) return;

    const checkOverflow = () => {
      setHasOverflow(isOverflowed(contentElement, verticalTolerance));
    };

    targetElement.addEventListener('mouseenter', checkOverflow);
    targetElement.addEventListener('focus', checkOverflow);

    return () => {
      targetElement.removeEventListener('mouseenter', checkOverflow);
      targetElement.removeEventListener('focus', checkOverflow);
    };
  }, [targetElement, contentElement, verticalTolerance]);

  return hasOverflow;
};
