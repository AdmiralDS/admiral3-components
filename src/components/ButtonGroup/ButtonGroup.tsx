import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

import {
  ButtonGroupContext,
  type ButtonGroupButtonRegistration,
  type ButtonGroupButtonState,
} from './ButtonGroupContext';
import { StyledButtonGroup } from './style';
import type { ButtonGroupProps } from './types';
import { refSetter } from '../../utils/refSetter';

interface ButtonRegistryState {
  buttons: Map<symbol, ButtonGroupButtonRegistration>;
  focusableButtonId: symbol | null;
}

const getEnabledButtons = (
  container: HTMLDivElement | null,
  buttons: ReadonlyMap<symbol, ButtonGroupButtonRegistration>,
) => {
  if (!container) return [];

  const buttonsByElement = new Map<Element, ButtonGroupButtonRegistration>();
  buttons.forEach((button) => {
    if (button.ref.current) buttonsByElement.set(button.ref.current, button);
  });

  return Array.from(container.children).flatMap((element) => {
    const button = buttonsByElement.get(element);
    return button && !button.disabled && !button.skeleton ? [button] : [];
  });
};

const normalizeRegistry = (
  container: HTMLDivElement | null,
  buttons: Map<symbol, ButtonGroupButtonRegistration>,
  focusableButtonId: symbol | null,
): ButtonRegistryState => {
  const enabledButtons = getEnabledButtons(container, buttons);
  const hasFocusableButton = enabledButtons.some((button) => button.id === focusableButtonId);

  return {
    buttons,
    focusableButtonId: hasFocusableButton ? focusableButtonId : (enabledButtons[0]?.id ?? null),
  };
};

const getEventButton = (
  container: HTMLDivElement | null,
  target: EventTarget | null,
  buttons: ReadonlyMap<symbol, ButtonGroupButtonRegistration>,
) => {
  if (!container) return undefined;
  // чтобы события работали и внутри iframe/другого document realm
  const NodeConstructor = container.ownerDocument.defaultView?.Node;
  if (!NodeConstructor || !(target instanceof NodeConstructor)) return undefined;

  return Array.from(buttons.values()).find(({ ref }) => {
    const element = ref.current;

    return element != null && element.parentElement === container && element.contains(target);
  });
};

/** ButtonGroup объединяет связанные Button и управляет фокусом между ними. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      children,
      appearance = 'solid',
      colorMode = 'colored',
      dimension = 'm',
      colorConfig,
      onBlur,
      onFocus,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const groupRef = useRef<HTMLDivElement | null>(null);
    const focusedButtonIdRef = useRef<symbol | null>(null);
    const focusTransferFromIdRef = useRef<symbol | null>(null);
    const [registry, setRegistry] = useState<ButtonRegistryState>(() => ({
      buttons: new Map(),
      focusableButtonId: null,
    }));
    const mergedRef = useMemo(() => refSetter(groupRef, ref), [ref]);

    const registerButton = useCallback((button: ButtonGroupButtonRegistration) => {
      const element = button.ref.current;
      if (!element || element.parentElement !== groupRef.current) return undefined;

      const alreadyFocused = element.ownerDocument.activeElement === element;
      if (!button.disabled && !button.skeleton && alreadyFocused) {
        focusedButtonIdRef.current = button.id;
      }

      setRegistry((current) => {
        const buttons = new Map(current.buttons);
        buttons.set(button.id, button);
        return normalizeRegistry(groupRef.current, buttons, focusedButtonIdRef.current ?? current.focusableButtonId);
      });

      return () => {
        if (focusedButtonIdRef.current === button.id) {
          focusTransferFromIdRef.current = button.id;
          focusedButtonIdRef.current = null;
        }

        setRegistry((current) => {
          if (!current.buttons.has(button.id)) return current;

          const buttons = new Map(current.buttons);
          buttons.delete(button.id);
          return normalizeRegistry(groupRef.current, buttons, focusedButtonIdRef.current ?? current.focusableButtonId);
        });
      };
    }, []);

    const updateButton = useCallback((id: symbol, state: ButtonGroupButtonState) => {
      if ((state.disabled || state.skeleton) && focusedButtonIdRef.current === id) {
        focusTransferFromIdRef.current = id;
        focusedButtonIdRef.current = null;
      }

      setRegistry((current) => {
        const button = current.buttons.get(id);
        if (!button || (button.disabled === state.disabled && button.skeleton === state.skeleton)) return current;

        const buttons = new Map(current.buttons);
        buttons.set(id, { ...button, ...state });
        return normalizeRegistry(groupRef.current, buttons, focusedButtonIdRef.current ?? current.focusableButtonId);
      });
    }, []);

    useLayoutEffect(() => {
      const previousButtonId = focusTransferFromIdRef.current;
      if (!previousButtonId) return;

      const previousButton = registry.buttons.get(previousButtonId);
      if (previousButton && !previousButton.disabled && !previousButton.skeleton) return;
      focusTransferFromIdRef.current = null;

      const container = groupRef.current;
      const nextButton = registry.focusableButtonId ? registry.buttons.get(registry.focusableButtonId) : undefined;
      const nextElement = nextButton?.ref.current;
      if (!container || !nextElement) return;

      const activeElement = container.ownerDocument.activeElement;
      const focusMovedOutside =
        activeElement !== null &&
        activeElement !== container.ownerDocument.body &&
        activeElement.isConnected &&
        !container.contains(activeElement);
      if (focusMovedOutside) return;

      nextElement.focus();
    }, [registry]);

    const setFocusableButton = useCallback((id: symbol) => {
      setRegistry((current) => {
        const button = current.buttons.get(id);
        if (!button || button.disabled || button.skeleton || current.focusableButtonId === id) return current;

        return { ...current, focusableButtonId: id };
      });
    }, []);

    const contextValue = useMemo(
      () => ({
        appearance,
        colorMode,
        dimension,
        colorConfig,
        focusableButtonId: registry.focusableButtonId,
        registerButton,
        updateButton,
      }),
      [appearance, colorMode, dimension, colorConfig, registry.focusableButtonId, registerButton, updateButton],
    );

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      onBlur?.(event);

      const button = getEventButton(groupRef.current, event.target, registry.buttons);
      if (button?.id === focusedButtonIdRef.current) focusedButtonIdRef.current = null;
    };

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (event.defaultPrevented) return;

      const button = getEventButton(groupRef.current, event.target, registry.buttons);
      if (!button || button.disabled || button.skeleton) return;

      focusedButtonIdRef.current = button.id;
      setFocusableButton(button.id);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const currentButton = getEventButton(groupRef.current, event.target, registry.buttons);
      if (!currentButton || currentButton.disabled || currentButton.skeleton) return;

      const buttons = getEnabledButtons(groupRef.current, registry.buttons);
      const currentIndex = buttons.findIndex((button) => button.id === currentButton.id);
      if (currentIndex === -1) return;

      let nextButton: ButtonGroupButtonRegistration | undefined;

      switch (event.key) {
        case 'ArrowRight':
          nextButton = buttons[currentIndex === buttons.length - 1 ? 0 : currentIndex + 1];
          break;
        case 'ArrowLeft':
          nextButton = buttons[currentIndex === 0 ? buttons.length - 1 : currentIndex - 1];
          break;
        case 'Home':
          nextButton = buttons[0];
          break;
        case 'End':
          nextButton = buttons.at(-1);
          break;
        default:
          return;
      }

      event.preventDefault();
      if (!nextButton) return;

      focusedButtonIdRef.current = nextButton.id;
      setFocusableButton(nextButton.id);
      nextButton.ref.current?.focus();
    };

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <StyledButtonGroup
          ref={mergedRef}
          {...props}
          role="group"
          $appearance={appearance}
          $colorMode={colorMode}
          $colorConfig={colorConfig}
          data-appearance={colorConfig ? 'custom' : appearance}
          data-color-mode={colorMode}
          data-dimension={dimension}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        >
          {/* TODO: После появления Tooltip добавить интеграцию для подписей icon-only кнопок;
          доступное имя через aria-label или aria-labelledby остаётся обязательным. */}
          {children}
        </StyledButtonGroup>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';
