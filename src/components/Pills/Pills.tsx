import { forwardRef, useCallback, useMemo, useRef, type FocusEvent, type KeyboardEvent } from 'react';

import { useRovingFocus } from '#src/hooks/useRovingFocus';

import { PillsContext, type PillRegistration } from './PillsContext';
import { StyledPills } from './style';
import type { PillsProps } from './types';
import { refSetter } from '../../utils/refSetter';

/** Pills объединяет Pill и управляет фокусом между сегментами группы. */
export const Pills = forwardRef<HTMLDivElement, PillsProps>(
  ({ children, connected = false, onBlur, onFocus, onKeyDown, ...props }, ref) => {
    const groupRef = useRef<HTMLDivElement | null>(null);
    const {
      focusableItemId,
      registerItem,
      updateItem,
      getItemByTarget,
      onBlur: handleRovingBlur,
      onFocus: handleRovingFocus,
      onKeyDown: handleRovingKeyDown,
    } = useRovingFocus<HTMLButtonElement, symbol>({ containerRef: groupRef });

    const registerPill = useCallback(
      (pill: PillRegistration) => {
        if (pill.ref.current?.parentElement !== groupRef.current) return undefined;
        return registerItem(pill);
      },
      [registerItem],
    );
    const updatePill = useCallback((id: symbol, disabled: boolean) => updateItem(id, { disabled }), [updateItem]);
    const contextValue = useMemo(
      () => ({ focusablePillId: focusableItemId, registerPill, updatePill }),
      [focusableItemId, registerPill, updatePill],
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
      if (event.defaultPrevented) return;

      const currentPill = getItemByTarget(event.target)?.ref.current;
      if (
        event.key === 'ArrowDown' &&
        currentPill &&
        (currentPill.getAttribute('aria-haspopup') === 'menu' || currentPill.getAttribute('aria-haspopup') === 'true')
      ) {
        event.preventDefault();
        currentPill.click();
        return;
      }
      handleRovingKeyDown(event);
    };

    return (
      <PillsContext.Provider value={contextValue}>
        <StyledPills
          ref={refSetter(groupRef, ref)}
          role="group"
          $connected={connected}
          {...props}
          data-connected={connected ? '' : undefined}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        >
          {children}
        </StyledPills>
      </PillsContext.Provider>
    );
  },
);

Pills.displayName = 'Pills';
