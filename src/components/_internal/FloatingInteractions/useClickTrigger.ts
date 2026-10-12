import type { AriaAttributes, HTMLAttributes, RefCallback } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { isElementInside } from './utils';
import { getNextTabbableElement, getTabbableElements } from '../../../utils/tabbableElements';

export interface UseClickTriggerOptions {
  /** Элемент, относительно которого позиционируется floating-элемент. Если не задан, используется сам триггер. */
  targetElement?: Element | null;
}

export interface UseClickTriggerResult<T extends HTMLElement = HTMLElement> {
  isVisible: boolean;
  triggerProps: {
    ref: RefCallback<T>;
    id: string;
    'aria-expanded': AriaAttributes['aria-expanded'];
    'aria-controls': AriaAttributes['aria-controls'];
    'aria-haspopup': 'dialog';
  };
  floatingProps: {
    ref: RefCallback<HTMLDivElement>;
    id: string;
    targetElement: Element | null;
    showCloseIcon: true;
    onClose: () => void;
    role: HTMLAttributes<HTMLDivElement>['role'];
    'aria-labelledby': AriaAttributes['aria-labelledby'];
  };
}

/**
 * Управляет floating-элементом, который открывается и закрывается активацией триггера.
 * Под активацией понимается click мышью, пальцем или пером либо нажатие Enter/Space,
 * когда фокус находится на триггере. Pointer-активация только переключает видимость,
 * а клавиатурная при открытии дополнительно переносит фокус на первый tabbable-элемент.
 * Программный click отдельно не классифицируется и обрабатывается как обычный click.
 *
 * Также закрывает floating-элемент по внешнему клику и Escape и обеспечивает линейную
 * клавиатурную навигацию по его содержимому.
 */
export const useClickTrigger = <T extends HTMLElement = HTMLElement>({
  targetElement,
}: UseClickTriggerOptions = {}): UseClickTriggerResult<T> => {
  const [triggerElement, setTriggerElement] = useState<T | null>(null);
  const [floatingElement, setFloatingElement] = useState<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);

  // Способ активации нужен только в момент открытия и не влияет на отрисовку,
  // поэтому храним его в ref, а не создаём дополнительное состояние.
  const keyboardActivationRef = useRef(false);

  const resolvedTargetElement = targetElement === undefined ? triggerElement : targetElement;
  const ownerDocument = triggerElement?.ownerDocument ?? floatingElement?.ownerDocument;
  const floatingId = useId();
  const triggerId = useId();

  const hide = useCallback(() => setVisible(false), []);

  // При закрытии через Escape, крестик или Shift+Tab пользователь должен вернуться
  // к элементу, из которого он вошёл во floating-элемент.
  const closeAndFocusTrigger = useCallback(() => {
    triggerElement?.focus();
    hide();
  }, [hide, triggerElement]);

  /**
   * Управляет активацией триггера и запоминает её способ. Pointer-активация переключает
   * видимость. Enter/Space также переключают её, но при открытии дополнительно разрешают перенести
   * фокус во floating-элемент. Стандартное клавиатурное действие при этом отменяется.
   */
  useEffect(() => {
    if (!triggerElement) return;

    const toggle = (keyboardActivation = false) => {
      const willOpen = !isVisible;
      keyboardActivationRef.current = keyboardActivation && willOpen;
      setVisible(willOpen);
    };

    const handleClick = () => {
      toggle();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      toggle(true);
    };

    triggerElement.addEventListener('click', handleClick);
    triggerElement.addEventListener('keydown', handleKeyDown);
    return () => {
      triggerElement.removeEventListener('click', handleClick);
      triggerElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, triggerElement]);

  /**
   * Пока floating-элемент открыт, закрывает его по Escape и по клику за пределами триггера
   * и floating-элемента.
   */
  useEffect(() => {
    if (!isVisible || !ownerDocument) return;

    const handleClick = (event: MouseEvent) => {
      // TODO: Когда появится DropdownProvider и реестр вложенных floating-элементов, учитывать портальные
      // dropdown внутри Hint как часть его интерактивной области. Сейчас такой dropdown находится вне
      // floatingElement в DOM, поэтому клик по нему будет ошибочно воспринят как внешний и закроет Hint.
      // Клики по триггеру и floating-элементу считаются внутренними. Отдельный targetElement
      // сюда намеренно не входит: он используется только для позиционирования.
      if (!isElementInside(triggerElement, event.target) && !isElementInside(floatingElement, event.target)) hide();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndFocusTrigger();
      }
    };

    ownerDocument.addEventListener('click', handleClick, { capture: true });
    ownerDocument.addEventListener('keydown', handleKeyDown);
    return () => {
      ownerDocument.removeEventListener('click', handleClick, { capture: true });
      ownerDocument.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeAndFocusTrigger, floatingElement, hide, isVisible, ownerDocument, triggerElement]);

  /**
   * После клавиатурного открытия переносит фокус на первый tabbable-элемент. Затем связывает
   * портальный floating-элемент с основным Tab-потоком: Shift+Tab с первого элемента возвращает
   * на триггер, а Tab с последнего — на следующий за триггером элемент страницы.
   */
  useEffect(() => {
    if (!isVisible || !floatingElement || !triggerElement) return;

    if (keyboardActivationRef.current) {
      getTabbableElements(floatingElement)[0]?.focus();
      keyboardActivationRef.current = false;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const tabbableElements = getTabbableElements(floatingElement);
      const firstElement = tabbableElements[0];
      const lastElement = tabbableElements[tabbableElements.length - 1];

      if (event.shiftKey && event.target === firstElement) {
        event.preventDefault();
        closeAndFocusTrigger();
      } else if (!event.shiftKey && event.target === lastElement) {
        event.preventDefault();
        const nextElement = getNextTabbableElement(triggerElement) ?? triggerElement;
        hide();
        nextElement.focus();
      }
    };

    floatingElement.addEventListener('keydown', handleKeyDown);
    return () => floatingElement.removeEventListener('keydown', handleKeyDown);
  }, [closeAndFocusTrigger, floatingElement, hide, isVisible, triggerElement]);

  const triggerProps = useMemo(
    () => ({
      ref: setTriggerElement,
      id: triggerId,
      'aria-expanded': isVisible,
      // Не ссылаемся на отсутствующий в DOM floating-элемент, пока он закрыт.
      'aria-controls': isVisible ? floatingId : undefined,
      'aria-haspopup': 'dialog' as const,
    }),
    [floatingId, isVisible, triggerId],
  );
  const floatingProps = useMemo(
    () => ({
      ref: setFloatingElement,
      id: floatingId,
      targetElement: resolvedTargetElement,
      showCloseIcon: true as const,
      onClose: closeAndFocusTrigger,
      role: 'dialog',
      // Текст триггера становится доступным именем dialog.
      'aria-labelledby': triggerId,
    }),
    [closeAndFocusTrigger, floatingId, resolvedTargetElement, triggerId],
  );

  return { isVisible, triggerProps, floatingProps };
};
