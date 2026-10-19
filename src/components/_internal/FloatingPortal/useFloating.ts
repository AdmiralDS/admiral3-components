import { useCallback, useEffect } from 'react';

import type { AutoUpdatePositionOptions } from '#src/utils/autoUpdatePosition';
import { autoUpdatePosition } from '#src/utils/autoUpdatePosition';

const synchronizeFloatingPortal = (floatingPortal: HTMLElement, targetRect: DOMRect) => {
  const { x, y, width, height } = targetRect;
  const { style } = floatingPortal;
  style.top = `${y}px`;
  style.left = `${x}px`;
  style.height = `${height}px`;
  style.width = `${width}px`;
};

export interface FloatingUpdateContext {
  /** DOM-элемент FloatingPortal, синхронизированный с targetElement. */
  floatingPortal: HTMLElement;
  /** Floating-элемент, который нужно позиционировать относительно targetElement. */
  floatingElement: HTMLElement;
  /** Измеренный прямоугольник targetElement. */
  targetRect: DOMRect;
}

export interface UseFloatingOptions {
  /** Элемент, относительно которого позиционируется FloatingPortal. */
  targetElement: Element | null;
  /** DOM-элемент FloatingPortal. */
  floatingPortal: HTMLElement | null;
  /** Позиционируемый элемент (Tooltip, Hint и т.д.), за изменением которого нужно следить. */
  floatingElement: HTMLElement | null;
  /** Источники автоматического обновления позиции floating-элемента. */
  autoUpdateOptions?: AutoUpdatePositionOptions;
  /** Вызывается после синхронизации FloatingPortal для дальнейшего позиционирования floatingElement. */
  onUpdate?: (context: FloatingUpdateContext) => void;
}

/**
 * Синхронизирует позицию и размеры FloatingPortal с targetElement.
 * Хук не выбирает placement и не позиционирует содержимое относительно
 * FloatingPortal: эта логика остаётся в Tooltip, Hint или другом компоненте.
 */
export const useFloating = ({
  targetElement,
  floatingPortal,
  floatingElement,
  autoUpdateOptions,
  onUpdate,
}: UseFloatingOptions): void => {
  const update = useCallback(() => {
    if (!targetElement || !floatingPortal || !floatingElement) return;

    const targetRect = targetElement.getBoundingClientRect();
    synchronizeFloatingPortal(floatingPortal, targetRect);
    onUpdate?.({ floatingElement, floatingPortal, targetRect });
  }, [floatingElement, floatingPortal, onUpdate, targetElement]);

  useEffect(() => {
    if (!targetElement || !floatingPortal || !floatingElement) return;

    const cleanup = autoUpdatePosition(targetElement, floatingElement, update, autoUpdateOptions);

    return cleanup;
  }, [autoUpdateOptions, floatingElement, floatingPortal, targetElement, update]);
};
