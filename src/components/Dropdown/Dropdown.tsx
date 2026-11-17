import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FakeTarget, DropdownContainer, StyledPortal } from './style';
import type { DropdownLayout, DropdownProps } from './types';
import { getDropdownLayout } from './utils';
import { refSetter } from '../../utils/refSetter';
import type { FloatingUpdateContext } from '../_internal/FloatingPortal';
import { useFloating } from '../_internal/FloatingPortal';

const INITIAL_LAYOUT: DropdownLayout = {
  position: 'bottom',
  alignSelf: 'flex-start',
  translateX: 0,
  translateY: 0,
  targetDetached: false,
};

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ align = 'auto', children, onTargetDetached, targetElement, widthMode = 'content', ...props }, ref) => {
    const [floatingPortal, setFloatingPortal] = useState<HTMLDivElement | null>(null);
    const [dropdownElement, setDropdownElement] = useState<HTMLDivElement | null>(null);
    const [layout, setLayout] = useState(INITIAL_LAYOUT);
    // Предыдущее измеренное detached-состояние нужно, чтобы сообщать только о переходе false -> true.
    const targetWasDetached = useRef<boolean | undefined>(undefined);
    const mergedRef = useMemo(() => refSetter(ref, setDropdownElement), [ref]);

    useEffect(() => {
      targetWasDetached.current = undefined;
    }, [targetElement]);

    const updateDropdown = useCallback(
      ({ floatingElement, targetRect }: FloatingUpdateContext) => {
        const view = targetElement?.ownerDocument.defaultView;
        if (!view) return;

        const nextLayout = getDropdownLayout(
          align,
          targetRect,
          floatingElement.getBoundingClientRect(),
          view.innerWidth,
          view.innerHeight,
        );
        if (targetWasDetached.current === false && nextLayout.targetDetached) onTargetDetached?.();
        targetWasDetached.current = nextLayout.targetDetached;
        setLayout((currentLayout) =>
          currentLayout.position === nextLayout.position &&
          currentLayout.alignSelf === nextLayout.alignSelf &&
          currentLayout.translateX === nextLayout.translateX &&
          currentLayout.translateY === nextLayout.translateY &&
          currentLayout.targetDetached === nextLayout.targetDetached
            ? currentLayout
            : nextLayout,
        );
        floatingElement.style.opacity = '1';
      },
      [align, onTargetDetached, targetElement],
    );

    useFloating({
      targetElement,
      floatingPortal,
      floatingElement: dropdownElement,
      onUpdate: updateDropdown,
    });

    if (!targetElement) return null;

    return (
      <StyledPortal targetElement={targetElement} ref={setFloatingPortal} $position={layout.position}>
        <FakeTarget />
        <DropdownContainer ref={mergedRef} $layout={layout} $widthMode={widthMode} {...props}>
          {children}
        </DropdownContainer>
      </StyledPortal>
    );
  },
);

Dropdown.displayName = 'Dropdown';
