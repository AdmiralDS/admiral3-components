import type { AriaAttributes, HTMLAttributes, RefCallback } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { isElementInside } from './utils';
import { getNextTabbableElement, getTabbableElements } from '../../../utils/tabbableElements';

const NATIVE_INTERACTIVE_SELECTOR = [
  'button',
  'a[href]',
  'area[href]',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',');

/** Нативные интерактивные элементы сами преобразуют поддерживаемые клавиши в click. */
const hasNativeKeyboardActivation = (element: HTMLElement) => element.matches(NATIVE_INTERACTIVE_SELECTOR);

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
 *
 * Под активацией понимается click мышью, пальцем или пером, либо клавиатурная активация триггера.
 * Для нативного интерактивного элемента используется созданный браузером click. Для остальных
 * элементов хук добавляет button-семантику: Enter активирует на keydown, Space — на keyup.
 * Pointer-активация только переключает видимость, а клавиатурная при открытии дополнительно
 * переносит фокус на первый tabbable-элемент. Программный click не считается клавиатурной активацией.
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

  // Переносить фокус во floating-элемент только после клавиатурного открытия.
  const keyboardActivationRef = useRef(false);
  // Активировать ненативный триггер на keyup только после обработанного keydown Space.
  const spaceKeyDownRef = useRef(false);

  const resolvedTargetElement = targetElement === undefined ? triggerElement : targetElement;
  const ownerDocument = triggerElement?.ownerDocument ?? floatingElement?.ownerDocument;
  const floatingId = useId();
  const triggerId = useId();

  const hide = useCallback(() => setVisible(false), []);

  /**
   * При закрытии через Escape, крестик или Shift+Tab пользователь должен вернуться
   * к элементу, из которого он вошёл во floating-элемент.
   */
  const closeAndFocusTrigger = useCallback(() => {
    triggerElement?.focus();
    hide();
  }, [hide, triggerElement]);

  /**
   * Управляет активацией триггера и запоминает её способ. Нативные интерактивные элементы
   * активируются только через click. Для ненативного элемента воспроизводится button-семантика (Enter/Space активация).
   */
  useEffect(() => {
    if (!triggerElement) return;

    const toggle = (keyboardActivation = false) => {
      const willOpen = !isVisible;
      keyboardActivationRef.current = keyboardActivation && willOpen;
      setVisible(willOpen);
    };

    const nativeKeyboardActivation = hasNativeKeyboardActivation(triggerElement);

    const handleClick = (event: MouseEvent) => {
      /**
       * detail=0 - признак нативного click от клавиатуры или assistive technology
       * isTrusted=true проверяет, что click не был программным
       */

      toggle(nativeKeyboardActivation && event.isTrusted && event.detail === 0);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (nativeKeyboardActivation || event.defaultPrevented || event.repeat) return;

      if (event.key === 'Enter') {
        toggle(true);
      } else if (event.key === ' ') {
        // Предотвращаем прокрутку страницы
        event.preventDefault();
        spaceKeyDownRef.current = true;
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (nativeKeyboardActivation || event.key !== ' ') return;

      const didKeyDown = spaceKeyDownRef.current;
      spaceKeyDownRef.current = false;
      if (event.defaultPrevented || !didKeyDown) return;

      toggle(true);
    };

    triggerElement.addEventListener('click', handleClick);
    triggerElement.addEventListener('keydown', handleKeyDown);
    triggerElement.addEventListener('keyup', handleKeyUp);
    return () => {
      triggerElement.removeEventListener('click', handleClick);
      triggerElement.removeEventListener('keydown', handleKeyDown);
      triggerElement.removeEventListener('keyup', handleKeyUp);
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
        const nextElement = getNextTabbableElement(triggerElement, floatingElement) ?? triggerElement;
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
