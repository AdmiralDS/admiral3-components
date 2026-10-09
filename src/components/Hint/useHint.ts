import { useCallback, useEffect, useId, useMemo, useState } from 'react';

import type { UseHintOptions, UseHintResult } from './types';
import { useTooltip } from '../Tooltip/useTooltip';

const isElementInside = (container: Element | null, element: EventTarget | null) =>
  Boolean(container && element && 'nodeType' in element && container.contains(element as Node));

const useClickHint = <T extends HTMLElement>(targetElement?: Element | null): UseHintResult<T> => {
  const [triggerElement, setTriggerElement] = useState<T | null>(null);
  const [hintElement, setHintElement] = useState<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);
  const resolvedTargetElement = targetElement === undefined ? triggerElement : targetElement;
  const hintId = useId();
  const ownerDocument = triggerElement?.ownerDocument ?? hintElement?.ownerDocument;

  const hideHint = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!triggerElement) return;

    const toggleHint = () => setVisible((visible) => !visible);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      // Предотвращаем дополнительный click, который браузер создаёт для нативных кнопок и ссылок.
      event.preventDefault();
      toggleHint();
    };

    triggerElement.addEventListener('click', toggleHint);
    triggerElement.addEventListener('keydown', handleKeyDown);
    return () => {
      triggerElement.removeEventListener('click', toggleHint);
      triggerElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerElement]);

  useEffect(() => {
    if (!isVisible || !ownerDocument) return;

    const handleClick = (event: MouseEvent) => {
      if (!isElementInside(triggerElement, event.target) && !isElementInside(hintElement, event.target)) {
        hideHint();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hideHint();
    };

    ownerDocument.addEventListener('click', handleClick, { capture: true });
    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      ownerDocument.removeEventListener('click', handleClick, { capture: true });
      ownerDocument.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [hideHint, hintElement, isVisible, ownerDocument, triggerElement]);

  const triggerProps = useMemo(
    () => ({
      ref: setTriggerElement,
      'aria-describedby': isVisible ? hintId : undefined,
      'aria-expanded': isVisible,
    }),
    [hintId, isVisible],
  );
  const hintProps = useMemo(
    () => ({
      ref: setHintElement,
      id: hintId,
      targetElement: resolvedTargetElement,
      showCloseIcon: true,
      onClose: hideHint,
    }),
    [hideHint, hintId, resolvedTargetElement],
  );

  return { isVisible, triggerProps, hintProps };
};

/**
 * Управляет Hint в одном из двух режимов:
 * - hover: открывает при наведении или фокусе, закрывает при уходе, потере фокуса или по Escape;
 * - click: открывает по клику, Enter или Space, закрывает по повторному клику, крестику, Escape или клику вне Hint.
 * Элемент позиционирования может отличаться от триггера, но не входит в интерактивную область Hint.
 */
export const useHint = <T extends HTMLElement = HTMLElement>(options: UseHintOptions = {}): UseHintResult<T> => {
  const { visibilityTrigger = 'hover', ...tooltipOptions } = options;
  const clickHint = useClickHint<T>(tooltipOptions.targetElement);
  const { isVisible, triggerProps, tooltipProps } = useTooltip<T>(tooltipOptions);

  if (visibilityTrigger === 'click') return clickHint;
  return { isVisible, triggerProps, hintProps: tooltipProps };
};
