import { useCallback, useEffect, useRef, useState } from 'react';

const isElementInside = (container: Element | null, element: EventTarget | null) =>
  element instanceof Node && Boolean(container?.contains(element));

export interface UseTooltipOptions {
  /** Задержка перед открытием Tooltip в миллисекундах. Значение по умолчанию 0. */
  openDelay?: number;
}

export interface UseTooltipResult<T extends HTMLElement> {
  /** Элемент, относительно которого позиционируется Tooltip. */
  targetElement: T | null;
  /** Callback ref для якорного элемента. */
  targetRef: (element: T | null) => void;
  /**
   * Callback ref для Tooltip. Внешняя обёртка Tooltip имеет прозрачный padding,
   * который образует интерактивный мост до якоря.
   */
  tooltipRef: (element: HTMLDivElement | null) => void;
  /** Признак видимости Tooltip. */
  isVisible: boolean;
  /** Показывает Tooltip с учётом openDelay. */
  showTooltip: () => void;
  /** Немедленно скрывает Tooltip. */
  hideTooltip: () => void;
}

/**
 * Управляет показом Tooltip по hover и focus, использует невидимый интерактивный
 * мост между якорем и Tooltip и закрывает Tooltip по Escape.
 */
export const useTooltip = <T extends HTMLElement = HTMLElement>({
  openDelay = 0,
}: UseTooltipOptions = {}): UseTooltipResult<T> => {
  const [targetElement, setTargetElement] = useState<T | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerCheckFrameRef = useRef<number | null>(null);
  const interactionInProgressRef = useRef(false);

  const cancelOpening = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = null;
  }, []);

  const showTooltip = useCallback(() => {
    cancelOpening();
    if (openDelay > 0) {
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        setVisible(true);
      }, openDelay);
    } else {
      setVisible(true);
    }
  }, [cancelOpening, openDelay]);

  const hideTooltip = useCallback(() => {
    cancelOpening();
    interactionInProgressRef.current = false;
    setVisible(false);
  }, [cancelOpening]);

  const cancelPointerCheck = useCallback(() => {
    if (pointerCheckFrameRef.current !== null) cancelAnimationFrame(pointerCheckFrameRef.current);
    pointerCheckFrameRef.current = null;
  }, []);

  const hideIfPointerOutside = useCallback(
    (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget;

      // relatedTarget позволяет не закрывать Tooltip при переходе между якорем
      // и прозрачной областью внешней обёртки Tooltip.
      if (
        isElementInside(targetElement, relatedTarget) ||
        isElementInside(tooltipElement, relatedTarget) ||
        interactionInProgressRef.current
      ) {
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
      pointerCheckFrameRef.current = requestAnimationFrame(() => {
        pointerCheckFrameRef.current = null;
        const hoveredElement = document.elementFromPoint(clientX, clientY);
        if (
          !interactionInProgressRef.current &&
          !isElementInside(targetElement, hoveredElement) &&
          !isElementInside(tooltipElement, hoveredElement)
        ) {
          hideTooltip();
        }
      });
    },
    [cancelPointerCheck, hideTooltip, targetElement, tooltipElement],
  );

  useEffect(() => {
    if (!targetElement) return;

    const handleBlur = (event: FocusEvent) => {
      // При pointerdown внутри Tooltip blur якоря может прийти с relatedTarget=null.
      // Не закрываем Tooltip до завершения клика или выделения текста.
      if (
        !interactionInProgressRef.current &&
        !isElementInside(tooltipElement, event.relatedTarget) &&
        !isElementInside(targetElement, event.relatedTarget)
      ) {
        hideTooltip();
      }
    };

    // Нативные события корректно обрабатывают переход с disabled-элемента на якорь.
    targetElement.addEventListener('mouseenter', showTooltip);
    targetElement.addEventListener('focus', showTooltip);
    targetElement.addEventListener('mouseleave', hideIfPointerOutside);
    targetElement.addEventListener('blur', handleBlur);

    return () => {
      targetElement.removeEventListener('mouseenter', showTooltip);
      targetElement.removeEventListener('focus', showTooltip);
      targetElement.removeEventListener('mouseleave', hideIfPointerOutside);
      targetElement.removeEventListener('blur', handleBlur);
    };
  }, [hideIfPointerOutside, hideTooltip, showTooltip, targetElement, tooltipElement]);

  useEffect(() => {
    if (!tooltipElement) return;

    const handleFocusOut = (event: FocusEvent) => {
      if (
        !interactionInProgressRef.current &&
        !isElementInside(tooltipElement, event.relatedTarget) &&
        !isElementInside(targetElement, event.relatedTarget)
      ) {
        hideTooltip();
      }
    };
    const handlePointerDown = () => {
      // Пока пользователь нажимает кнопку мыши или выделяет текст внутри Tooltip,
      // mouseleave/blur не должны размонтировать элемент под указателем.
      interactionInProgressRef.current = true;
    };

    tooltipElement.addEventListener('mouseenter', cancelOpening);
    tooltipElement.addEventListener('mouseleave', hideIfPointerOutside);
    tooltipElement.addEventListener('focusin', cancelOpening);
    tooltipElement.addEventListener('focusout', handleFocusOut);
    tooltipElement.addEventListener('pointerdown', handlePointerDown);

    return () => {
      tooltipElement.removeEventListener('mouseenter', cancelOpening);
      tooltipElement.removeEventListener('mouseleave', hideIfPointerOutside);
      tooltipElement.removeEventListener('focusin', cancelOpening);
      tooltipElement.removeEventListener('focusout', handleFocusOut);
      tooltipElement.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [cancelOpening, hideIfPointerOutside, hideTooltip, targetElement, tooltipElement]);

  useEffect(() => {
    const handlePointerEnd = (event: PointerEvent) => {
      if (!interactionInProgressRef.current) return;

      interactionInProgressRef.current = false;
      const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);

      // Если пользователь закончил выделение за пределами обеих интерактивных
      // областей, закрываем Tooltip сразу после завершения взаимодействия.
      if (!isElementInside(targetElement, hoveredElement) && !isElementInside(tooltipElement, hoveredElement)) {
        hideTooltip();
      }
    };

    document.addEventListener('pointerup', handlePointerEnd);
    document.addEventListener('pointercancel', handlePointerEnd);
    return () => {
      document.removeEventListener('pointerup', handlePointerEnd);
      document.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [hideTooltip, targetElement, tooltipElement]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hideTooltip();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hideTooltip, isVisible]);

  useEffect(
    () => () => {
      cancelOpening();
      cancelPointerCheck();
    },
    [cancelOpening, cancelPointerCheck],
  );

  return {
    targetElement,
    targetRef: setTargetElement,
    tooltipRef: setTooltipElement,
    isVisible,
    showTooltip,
    hideTooltip,
  };
};
