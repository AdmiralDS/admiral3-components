import { forwardRef, useLayoutEffect, useMemo, useRef, type FocusEvent, type KeyboardEvent } from 'react';

import { ButtonGroupContext } from './ButtonGroupContext';
import { StyledButtonGroup } from './style';
import type { ButtonGroupProps } from './types';
import { refSetter } from '../../utils/refSetter';

const getButtonElements = (container: HTMLDivElement | null) => {
  if (!container) return [];

  return Array.from(container.children).filter(
    (element): element is HTMLButtonElement => element instanceof HTMLButtonElement,
  );
};

const getEnabledButtonElements = (container: HTMLDivElement | null) => {
  return getButtonElements(container).filter(
    (button) => !button.disabled && !button.hasAttribute('data-button-skeleton'),
  );
};

const setActiveButton = (container: HTMLDivElement | null, activeButton: HTMLButtonElement | undefined) => {
  getButtonElements(container).forEach((button) => {
    button.tabIndex = button === activeButton ? 0 : -1;
  });
};

const getEventButton = (container: HTMLDivElement | null, target: EventTarget | null) => {
  if (!container || !(target instanceof Element)) return undefined;

  const button = target.closest<HTMLButtonElement>('button');
  return button?.parentElement === container ? button : undefined;
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
      onFocus,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const groupRef = useRef<HTMLDivElement | null>(null);
    const activeButtonRef = useRef<HTMLButtonElement | null>(null);
    const contextValue = useMemo(
      () => ({ appearance, colorMode, dimension, colorConfig }),
      [appearance, colorMode, dimension, colorConfig],
    );

    useLayoutEffect(() => {
      const buttons = getEnabledButtonElements(groupRef.current);
      const activeButton =
        buttons.find((button) => button === activeButtonRef.current) ??
        buttons.find((button) => button.tabIndex === 0) ??
        buttons[0];

      activeButtonRef.current = activeButton ?? null;
      setActiveButton(groupRef.current, activeButton);
    }, [children, appearance, colorMode, dimension, colorConfig]);

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (event.defaultPrevented) return;

      const button = getEventButton(groupRef.current, event.target);

      if (button && !button.disabled && !button.hasAttribute('data-button-skeleton')) {
        activeButtonRef.current = button;
        setActiveButton(groupRef.current, button);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const currentButton = getEventButton(groupRef.current, event.target);
      if (!currentButton || currentButton.disabled || currentButton.hasAttribute('data-button-skeleton')) return;

      const buttons = getEnabledButtonElements(groupRef.current);
      const currentIndex = buttons.indexOf(currentButton);
      if (currentIndex === -1) return;

      let nextButton: HTMLButtonElement | undefined;

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
      activeButtonRef.current = nextButton ?? null;
      setActiveButton(groupRef.current, nextButton);
      nextButton?.focus();
    };

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <StyledButtonGroup
          ref={refSetter(groupRef, ref)}
          {...props}
          role="toolbar"
          aria-orientation="horizontal"
          $appearance={appearance}
          data-appearance={colorConfig ? 'custom' : appearance}
          data-color-mode={colorMode}
          data-dimension={dimension}
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
