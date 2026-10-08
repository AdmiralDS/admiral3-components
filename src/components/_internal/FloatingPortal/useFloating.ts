import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import type { AutoUpdatePositionOptions } from '#src/utils/autoUpdatePosition';
import { autoUpdatePosition } from '#src/utils/autoUpdatePosition';

export interface FloatingUpdateContext<T extends HTMLElement = HTMLDivElement> {
  /** Элемент, относительно которого позиционируется floating-контейнер. */
  targetElement: Element;
  /** Fixed-контейнер FloatingPortal. */
  floatingElement: T;
  /** Измеренный прямоугольник targetElement. */
  targetRect: DOMRect;
}

export interface UseFloatingOptions<T extends HTMLElement = HTMLDivElement> {
  /** Элемент, с прямоугольником которого синхронизируется floating-контейнер. */
  targetElement: Element | null;
  /** Источники автоматического пересчёта позиции. */
  autoUpdateOptions?: AutoUpdatePositionOptions;
  /** Вызывается после синхронизации контейнера, например для выбора placement. */
  onUpdate?: (context: FloatingUpdateContext<T>) => void;
}

export interface UseFloatingResult<T extends HTMLElement = HTMLDivElement> {
  /** Ref fixed-контейнера FloatingPortal. */
  floatingPortalRef: RefObject<T | null>;
}

/**
 * Синхронизирует fixed-контейнер с позицией и размерами targetElement.
 * Хук не выбирает placement и не позиционирует содержимое относительно
 * контейнера: эта логика остаётся в Tooltip, Hint или другом floating-компоненте.
 */
export const useFloating = <T extends HTMLElement = HTMLDivElement>({
  targetElement,
  autoUpdateOptions,
  onUpdate,
}: UseFloatingOptions<T>): UseFloatingResult<T> => {
  const floatingPortalRef = useRef<T | null>(null);

  const update = useCallback(() => {
    const floatingElement = floatingPortalRef.current;
    if (!targetElement || !floatingElement) return;

    const targetRect = targetElement.getBoundingClientRect();
    const { x, y, width, height } = targetRect;
    const { style } = floatingElement;
    style.top = `${y}px`;
    style.left = `${x}px`;
    style.height = `${height}px`;
    style.width = `${width}px`;
    onUpdate?.({ targetElement, floatingElement, targetRect });
  }, [onUpdate, targetElement]);

  useEffect(() => {
    const floatingElement = floatingPortalRef.current;
    if (!targetElement || !floatingElement) return;

    const cleanup = autoUpdatePosition(targetElement, floatingElement, update, autoUpdateOptions);

    return cleanup;
  }, [autoUpdateOptions, targetElement, update]);

  return { floatingPortalRef };
};
