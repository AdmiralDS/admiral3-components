import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import type { UseTooltipOptions, UseTooltipResult } from './types';

const isElementInside = (container: Element | null, element: EventTarget | null) =>
  Boolean(container && element && 'nodeType' in element && container.contains(element as Node));

/** Рекомендуемая задержка открытия Tooltip при наведении в миллисекундах. */
export const TOOLTIP_DELAY = 1500;

/**
 * Предоставляет свойства для элемента-триггера и Tooltip и управляет его открытием при наведении
 * или получении фокуса. Поддерживает отложенное открытие и закрытие по Escape.
 * Элемент позиционирования может отличаться от триггера, но не входит в интерактивную область Tooltip.
 */
export const useTooltip = <T extends HTMLElement = HTMLElement>({
  delay = 0,
  targetElement,
}: UseTooltipOptions = {}): UseTooltipResult<T> => {
  const [triggerElement, setTriggerElement] = useState<T | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);
  const resolvedTargetElement = targetElement === undefined ? triggerElement : targetElement;
  const tooltipId = useId();
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerCheckFrameRef = useRef<number | null>(null);
  const pointerCheckWindowRef = useRef<Window | null>(null);
  const interactionInProgressRef = useRef(false);
  const ownerDocument = triggerElement?.ownerDocument ?? tooltipElement?.ownerDocument;

  const isInsideTooltipArea = useCallback(
    (element: EventTarget | null) =>
      isElementInside(triggerElement, element) || isElementInside(tooltipElement, element),
    [triggerElement, tooltipElement],
  );

  const cancelOpening = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = null;
  }, []);

  const showTooltip = useCallback(() => {
    cancelOpening();
    setVisible(true);
  }, [cancelOpening]);

  const showTooltipOnHover = useCallback(() => {
    cancelOpening();
    if (delay <= 0) {
      setVisible(true);
      return;
    }

    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      setVisible(true);
    }, delay);
  }, [cancelOpening, delay]);

  const hideTooltip = useCallback(() => {
    cancelOpening();
    interactionInProgressRef.current = false;
    setVisible(false);
  }, [cancelOpening]);

  const cancelPointerCheck = useCallback(() => {
    if (pointerCheckFrameRef.current !== null) {
      pointerCheckWindowRef.current?.cancelAnimationFrame(pointerCheckFrameRef.current);
    }
    pointerCheckFrameRef.current = null;
    pointerCheckWindowRef.current = null;
  }, []);

  const hideIfPointerOutside = useCallback(
    (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget;

      // relatedTarget позволяет не закрывать Tooltip при переходе между якорем
      // и прозрачной областью внешней обёртки Tooltip.
      if (isInsideTooltipArea(relatedTarget) || interactionInProgressRef.current) {
        return;
      }

      if (relatedTarget) {
        hideTooltip();
        return;
      }

      // В некоторых браузерных сценариях relatedTarget отсутствует: например,
      // при быстром движении между порталами или одновременном изменении DOM.
      // На следующем кадре проверяем фактический элемент под указателем.
      const { clientX, clientY } = event;
      cancelPointerCheck();
      const ownerWindow = ownerDocument?.defaultView;
      if (!ownerWindow) {
        hideTooltip();
        return;
      }

      pointerCheckWindowRef.current = ownerWindow;
      pointerCheckFrameRef.current = ownerWindow.requestAnimationFrame(() => {
        pointerCheckFrameRef.current = null;
        pointerCheckWindowRef.current = null;
        const hoveredElement = ownerDocument?.elementFromPoint(clientX, clientY) ?? null;
        if (!interactionInProgressRef.current && !isInsideTooltipArea(hoveredElement)) {
          hideTooltip();
        }
      });
    },
    [cancelPointerCheck, hideTooltip, isInsideTooltipArea, ownerDocument],
  );

  const hideIfFocusOutside = useCallback(
    (event: FocusEvent) => {
      // При pointerdown внутри Tooltip blur якоря может прийти с relatedTarget=null.
      // Не закрываем Tooltip до завершения клика или выделения текста.
      if (!interactionInProgressRef.current && !isInsideTooltipArea(event.relatedTarget)) {
        hideTooltip();
      }
    },
    [hideTooltip, isInsideTooltipArea],
  );

  useEffect(() => {
    if (!triggerElement) return;

    // Нативные события корректно обрабатывают переход с disabled-элемента на якорь.
    triggerElement.addEventListener('mouseenter', showTooltipOnHover);
    triggerElement.addEventListener('focus', showTooltip);
    triggerElement.addEventListener('mouseleave', hideIfPointerOutside);
    triggerElement.addEventListener('blur', hideIfFocusOutside);

    return () => {
      triggerElement.removeEventListener('mouseenter', showTooltipOnHover);
      triggerElement.removeEventListener('focus', showTooltip);
      triggerElement.removeEventListener('mouseleave', hideIfPointerOutside);
      triggerElement.removeEventListener('blur', hideIfFocusOutside);
    };
  }, [hideIfFocusOutside, hideIfPointerOutside, showTooltip, showTooltipOnHover, triggerElement]);

  useEffect(() => {
    if (!tooltipElement) return;

    const handlePointerDown = () => {
      // Пока пользователь нажимает кнопку мыши или выделяет текст внутри Tooltip,
      // mouseleave/blur не должны размонтировать элемент под указателем.
      interactionInProgressRef.current = true;
    };

    tooltipElement.addEventListener('mouseenter', cancelOpening);
    tooltipElement.addEventListener('mouseleave', hideIfPointerOutside);
    tooltipElement.addEventListener('focusin', cancelOpening);
    tooltipElement.addEventListener('focusout', hideIfFocusOutside);
    tooltipElement.addEventListener('pointerdown', handlePointerDown);

    return () => {
      tooltipElement.removeEventListener('mouseenter', cancelOpening);
      tooltipElement.removeEventListener('mouseleave', hideIfPointerOutside);
      tooltipElement.removeEventListener('focusin', cancelOpening);
      tooltipElement.removeEventListener('focusout', hideIfFocusOutside);
      tooltipElement.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [cancelOpening, hideIfFocusOutside, hideIfPointerOutside, tooltipElement]);

  useEffect(() => {
    if (!ownerDocument) return;

    const handlePointerEnd = (event: PointerEvent) => {
      if (!interactionInProgressRef.current) return;

      interactionInProgressRef.current = false;
      const hoveredElement = ownerDocument.elementFromPoint(event.clientX, event.clientY);

      // Если пользователь закончил выделение за пределами обеих интерактивных
      // областей, закрываем Tooltip сразу после завершения взаимодействия.
      if (!isInsideTooltipArea(hoveredElement)) {
        hideTooltip();
      }
    };

    ownerDocument.addEventListener('pointerup', handlePointerEnd);
    ownerDocument.addEventListener('pointercancel', handlePointerEnd);
    return () => {
      ownerDocument.removeEventListener('pointerup', handlePointerEnd);
      ownerDocument.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [hideTooltip, isInsideTooltipArea, ownerDocument]);

  useEffect(() => {
    if (!ownerDocument) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hideTooltip();
    };

    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [hideTooltip, ownerDocument]);

  useEffect(
    () => () => {
      cancelOpening();
      cancelPointerCheck();
    },
    [cancelOpening, cancelPointerCheck],
  );

  const triggerProps = useMemo(
    () => ({ ref: setTriggerElement, 'aria-describedby': isVisible ? tooltipId : undefined }),
    [isVisible, tooltipId],
  );
  const tooltipProps = useMemo(
    () => ({ ref: setTooltipElement, id: tooltipId, targetElement: resolvedTargetElement }),
    [resolvedTargetElement, tooltipId],
  );

  return {
    isVisible,
    triggerProps,
    tooltipProps,
  };
};
