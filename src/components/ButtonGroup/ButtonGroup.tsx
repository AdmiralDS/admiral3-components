import { forwardRef, useCallback, useMemo, useRef, type FocusEvent, type KeyboardEvent } from 'react';

import { useRovingFocus } from '#src/hooks/useRovingFocus';

import {
  ButtonGroupContext,
  type ButtonGroupButtonRegistration,
  type ButtonGroupButtonState,
} from './ButtonGroupContext';
import { StyledButtonGroup } from './style';
import type { ButtonGroupProps } from './types';
import { refSetter } from '../../utils/refSetter';

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
    const mergedRef = useMemo(() => refSetter(groupRef, ref), [ref]);
    const {
      focusableItemId,
      registerItem,
      updateItem,
      onBlur: handleRovingBlur,
      onFocus: handleRovingFocus,
      onKeyDown: handleRovingKeyDown,
    } = useRovingFocus<HTMLButtonElement, symbol>({ containerRef: groupRef });

    const registerButton = useCallback(
      (button: ButtonGroupButtonRegistration) => {
        const element = button.ref.current;
        if (!element || element.parentElement !== groupRef.current) return undefined;
        return registerItem({
          id: button.id,
          ref: button.ref,
          disabled: button.disabled || button.skeleton,
        });
      },
      [registerItem],
    );

    const updateButton = useCallback(
      (id: symbol, state: ButtonGroupButtonState) => {
        updateItem(id, { disabled: state.disabled || state.skeleton });
      },
      [updateItem],
    );

    const contextValue = useMemo(
      () => ({
        appearance,
        colorMode,
        dimension,
        colorConfig,
        focusableButtonId: focusableItemId,
        registerButton,
        updateButton,
      }),
      [appearance, colorMode, dimension, colorConfig, focusableItemId, registerButton, updateButton],
    );

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      onBlur?.(event);
      handleRovingBlur(event);
    };

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (!event.defaultPrevented) handleRovingFocus(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      handleRovingKeyDown(event);
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
          {children}
        </StyledButtonGroup>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';
