import { forwardRef, useLayoutEffect, useRef, type FocusEvent, type KeyboardEvent } from 'react';

import { StyledPills } from './style';
import type { PillsProps } from './types';
import { refSetter } from '../../utils/refSetter';

const getPillElements = (container: HTMLDivElement | null) => {
  if (!container) return [];

  return Array.from(container.children).filter(
    (element): element is HTMLButtonElement =>
      element instanceof HTMLButtonElement && element.hasAttribute('data-pill'),
  );
};

const getEnabledPillElements = (container: HTMLDivElement | null) => {
  return getPillElements(container).filter((pill) => !pill.disabled);
};

const setActivePill = (container: HTMLDivElement | null, activePill: HTMLButtonElement | undefined) => {
  getPillElements(container).forEach((pill) => {
    pill.tabIndex = pill === activePill ? 0 : -1;
  });
};

const getEventPill = (container: HTMLDivElement | null, target: EventTarget | null) => {
  if (!container || !(target instanceof Element)) return undefined;

  const pill = target.closest<HTMLButtonElement>('[data-pill]');
  return pill?.parentElement === container ? pill : undefined;
};

/** Pills объединяет Pill и управляет фокусом между сегментами группы. */
export const Pills = forwardRef<HTMLDivElement, PillsProps>(
  ({ children, connected = false, onFocus, onKeyDown, ...props }, ref) => {
    const groupRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      const pills = getEnabledPillElements(groupRef.current);
      const activePill = pills.find((pill) => pill.tabIndex === 0) ?? pills[0];

      setActivePill(groupRef.current, activePill);
    }, [children]);

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      const pill = getEventPill(groupRef.current, event.target);

      if (pill && !pill.disabled) {
        setActivePill(groupRef.current, pill);
      }

      onFocus?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const currentPill = getEventPill(groupRef.current, event.target);
      if (!currentPill || currentPill.disabled) return;

      const pills = getEnabledPillElements(groupRef.current);
      const currentIndex = pills.indexOf(currentPill);
      if (currentIndex === -1) return;

      let nextPill: HTMLButtonElement | undefined;

      switch (event.key) {
        case 'ArrowRight':
          nextPill = pills[currentIndex === pills.length - 1 ? 0 : currentIndex + 1];
          break;
        case 'ArrowLeft':
          nextPill = pills[currentIndex === 0 ? pills.length - 1 : currentIndex - 1];
          break;
        case 'Home':
          nextPill = pills[0];
          break;
        case 'End':
          nextPill = pills.at(-1);
          break;
        case 'ArrowDown':
          if (
            currentPill.getAttribute('aria-haspopup') === 'menu' ||
            currentPill.getAttribute('aria-haspopup') === 'true'
          ) {
            event.preventDefault();
            currentPill.click();
          }
          return;
        default:
          return;
      }

      event.preventDefault();
      setActivePill(groupRef.current, nextPill);
      nextPill?.focus();
    };

    return (
      <StyledPills
        ref={refSetter(groupRef, ref)}
        role="toolbar"
        aria-orientation="horizontal"
        $connected={connected}
        {...props}
        data-connected={connected ? '' : undefined}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {children}
      </StyledPills>
    );
  },
);

Pills.displayName = 'Pills';
