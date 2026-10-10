import type { AriaAttributes, RefCallback } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { isElementInside } from './utils';

export interface UseHoverTriggerOptions {
  delay?: number;
  targetElement?: Element | null;
}

export interface UseHoverTriggerResult<T extends HTMLElement = HTMLElement> {
  isVisible: boolean;
  triggerProps: {
    ref: RefCallback<T>;
    'aria-describedby': AriaAttributes['aria-describedby'];
  };
  floatingProps: {
    ref: RefCallback<HTMLDivElement>;
    id: string;
    targetElement: Element | null;
  };
}

/**
 * Предоставляет свойства для элемента-триггера и floating-элемента и управляет открытием при наведении
 * или получении фокуса. Поддерживает отложенное открытие и закрытие по Escape.
 * Элемент позиционирования может отличаться от триггера, но не входит в интерактивную область.
 */
export const useHoverTrigger = <T extends HTMLElement = HTMLElement>({
  delay = 0,
  targetElement,
}: UseHoverTriggerOptions = {}): UseHoverTriggerResult<T> => {
  const [triggerElement, setTriggerElement] = useState<T | null>(null);
  const [floatingElement, setFloatingElement] = useState<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);
  const resolvedTargetElement = targetElement === undefined ? triggerElement : targetElement;
  const floatingId = useId();
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerCheckFrameRef = useRef<number | null>(null);
  const pointerCheckWindowRef = useRef<Window | null>(null);
  const triggerElementRef = useRef<T | null>(null);
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);
  const interactionInProgressRef = useRef(false);
  const ownerDocument = triggerElement?.ownerDocument ?? floatingElement?.ownerDocument;

  const isInsideInteractiveArea = useCallback(
    (element: EventTarget | null) =>
      isElementInside(triggerElement, element) || isElementInside(floatingElement, element),
    [floatingElement, triggerElement],
  );

  const cancelOpening = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = null;
  }, []);

  const show = useCallback(() => {
    cancelOpening();
    setVisible(true);
  }, [cancelOpening]);

  const handleTriggerMouseEnter = useCallback(() => {
    pointerInsideRef.current = true;
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

  const hide = useCallback(() => {
    cancelOpening();
    interactionInProgressRef.current = false;
    setVisible(false);
  }, [cancelOpening]);

  const hideIfInactive = useCallback(() => {
    if (!pointerInsideRef.current && !focusInsideRef.current && !interactionInProgressRef.current) {
      hide();
    }
  }, [hide]);

  const cancelPointerCheck = useCallback(() => {
    if (pointerCheckFrameRef.current !== null) {
      pointerCheckWindowRef.current?.cancelAnimationFrame(pointerCheckFrameRef.current);
    }
    pointerCheckFrameRef.current = null;
    pointerCheckWindowRef.current = null;
  }, []);

  const handleAreaMouseLeave = useCallback(
    (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget;

      // relatedTarget позволяет не закрывать floating-элемент при переходе между триггером
      // и прозрачной областью его внешней обёртки.
      if (isInsideInteractiveArea(relatedTarget)) {
        return;
      }

      if (relatedTarget) {
        pointerInsideRef.current = false;
        hideIfInactive();
        return;
      }

      // В некоторых браузерных сценариях relatedTarget отсутствует: например,
      // при быстром движении между порталами или одновременном изменении DOM.
      // На следующем кадре проверяем фактический элемент под указателем.
      const { clientX, clientY } = event;
      cancelPointerCheck();
      const ownerWindow = ownerDocument?.defaultView;
      if (!ownerWindow) {
        pointerInsideRef.current = false;
        hideIfInactive();
        return;
      }

      pointerCheckWindowRef.current = ownerWindow;
      pointerCheckFrameRef.current = ownerWindow.requestAnimationFrame(() => {
        pointerCheckFrameRef.current = null;
        pointerCheckWindowRef.current = null;
        const hoveredElement = ownerDocument?.elementFromPoint(clientX, clientY) ?? null;
        if (!isInsideInteractiveArea(hoveredElement)) {
          pointerInsideRef.current = false;
          hideIfInactive();
        }
      });
    },
    [cancelPointerCheck, hideIfInactive, isInsideInteractiveArea, ownerDocument],
  );

  const handleAreaFocusOut = useCallback(
    (event: FocusEvent) => {
      if (isInsideInteractiveArea(event.relatedTarget)) return;

      focusInsideRef.current = false;
      // При pointerdown внутри floating-элемента blur триггера может прийти с relatedTarget=null.
      // Не закрываем floating-элемент до завершения клика или выделения текста.
      hideIfInactive();
    },
    [hideIfInactive, isInsideInteractiveArea],
  );

  const handleTriggerFocus = useCallback(() => {
    focusInsideRef.current = true;
    show();
  }, [show]);

  const handleFloatingMouseEnter = useCallback(() => {
    pointerInsideRef.current = true;
    cancelOpening();
  }, [cancelOpening]);

  const handleFloatingFocusIn = useCallback(() => {
    focusInsideRef.current = true;
    cancelOpening();
  }, [cancelOpening]);

  useEffect(() => {
    if (!triggerElement) return;

    // Нативные события корректно обрабатывают переход с disabled-элемента на якорь.
    triggerElement.addEventListener('mouseenter', handleTriggerMouseEnter);
    triggerElement.addEventListener('focus', handleTriggerFocus);
    triggerElement.addEventListener('mouseleave', handleAreaMouseLeave);
    triggerElement.addEventListener('blur', handleAreaFocusOut);

    return () => {
      triggerElement.removeEventListener('mouseenter', handleTriggerMouseEnter);
      triggerElement.removeEventListener('focus', handleTriggerFocus);
      triggerElement.removeEventListener('mouseleave', handleAreaMouseLeave);
      triggerElement.removeEventListener('blur', handleAreaFocusOut);
    };
  }, [handleAreaFocusOut, handleAreaMouseLeave, handleTriggerFocus, handleTriggerMouseEnter, triggerElement]);

  useEffect(() => {
    if (!floatingElement) return;

    const handlePointerDown = () => {
      // Пока пользователь нажимает кнопку мыши или выделяет текст внутри floating-элемента,
      // mouseleave/blur не должны размонтировать элемент под указателем.
      interactionInProgressRef.current = true;
    };

    floatingElement.addEventListener('mouseenter', handleFloatingMouseEnter);
    floatingElement.addEventListener('mouseleave', handleAreaMouseLeave);
    floatingElement.addEventListener('focusin', handleFloatingFocusIn);
    floatingElement.addEventListener('focusout', handleAreaFocusOut);
    floatingElement.addEventListener('pointerdown', handlePointerDown);

    return () => {
      floatingElement.removeEventListener('mouseenter', handleFloatingMouseEnter);
      floatingElement.removeEventListener('mouseleave', handleAreaMouseLeave);
      floatingElement.removeEventListener('focusin', handleFloatingFocusIn);
      floatingElement.removeEventListener('focusout', handleAreaFocusOut);
      floatingElement.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [floatingElement, handleAreaFocusOut, handleAreaMouseLeave, handleFloatingFocusIn, handleFloatingMouseEnter]);

  useEffect(() => {
    if (!ownerDocument) return;

    const handlePointerEnd = (event: PointerEvent) => {
      if (!interactionInProgressRef.current) return;

      interactionInProgressRef.current = false;
      const hoveredElement = ownerDocument.elementFromPoint(event.clientX, event.clientY);

      // Если пользователь закончил выделение за пределами обеих интерактивных
      // областей, закрываем floating-элемент сразу после завершения взаимодействия.
      if (!isInsideInteractiveArea(hoveredElement)) {
        hide();
      }
    };

    ownerDocument.addEventListener('pointerup', handlePointerEnd);
    ownerDocument.addEventListener('pointercancel', handlePointerEnd);
    return () => {
      ownerDocument.removeEventListener('pointerup', handlePointerEnd);
      ownerDocument.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [hide, isInsideInteractiveArea, ownerDocument]);

  useEffect(() => {
    if (!ownerDocument) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };

    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [hide, ownerDocument]);

  useEffect(
    () => () => {
      cancelOpening();
      cancelPointerCheck();
    },
    [cancelOpening, cancelPointerCheck],
  );

  const setTriggerRef = useCallback(
    (element: T | null) => {
      if (triggerElementRef.current === element) return;

      cancelOpening();
      cancelPointerCheck();
      pointerInsideRef.current = false;
      focusInsideRef.current = false;
      interactionInProgressRef.current = false;
      triggerElementRef.current = element;
      setTriggerElement(element);
      setVisible(false);
    },
    [cancelOpening, cancelPointerCheck],
  );

  const triggerProps = useMemo(
    () => ({ ref: setTriggerRef, 'aria-describedby': isVisible ? floatingId : undefined }),
    [floatingId, isVisible, setTriggerRef],
  );
  const floatingProps = useMemo(
    () => ({ ref: setFloatingElement, id: floatingId, targetElement: resolvedTargetElement }),
    [floatingId, resolvedTargetElement],
  );

  return {
    isVisible,
    triggerProps,
    floatingProps,
  };
};
