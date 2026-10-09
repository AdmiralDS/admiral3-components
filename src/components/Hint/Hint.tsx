import { forwardRef, useCallback, useMemo, useState } from 'react';

import { FakeTarget, HintWrapper, StyledHint, StyledPortal } from './style';
import type { HintProps } from './types';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';
import type { FloatingUpdateContext } from '../_internal/FloatingPortal';
import { useFloating } from '../_internal/FloatingPortal';
import { TOOLTIP_LAYOUTS } from '../Tooltip/constants';
import { getTooltipDirection } from '../Tooltip/getTooltipDirection';

const stretchToViewportWidth = (floatingElement: HTMLElement) => {
  floatingElement.style.left = '0px';
  floatingElement.style.width = '100%';
};

/** Подсказка, которая позиционируется относительно targetElement. Управление видимостью вынесено в useHint. */
export const Hint = forwardRef<HTMLDivElement, HintProps>(
  ({ children, dimension = 'm', targetElement, hintPosition, ...props }, ref) => {
    const [floatingPortal, setFloatingPortal] = useState<HTMLDivElement | null>(null);
    const [hintElement, setHintElement] = useState<HTMLDivElement | null>(null);
    const [direction, setDirection] = useState<keyof typeof TOOLTIP_LAYOUTS>('bottom');
    const emptyContent = !hasSlotContent(children);
    const mergedRef = useMemo(() => refSetter(ref, setHintElement), [ref]);

    const updateHint = useCallback(
      ({ floatingElement, floatingPortal, targetRect }: FloatingUpdateContext) => {
        if (!targetElement) return;
        const nextDirection = getTooltipDirection(targetElement, targetRect, floatingElement, hintPosition);
        if (TOOLTIP_LAYOUTS[nextDirection].fullWidth) stretchToViewportWidth(floatingPortal);
        floatingElement.style.opacity = '1';
        setDirection(nextDirection);
      },
      [hintPosition, targetElement],
    );

    const layout = TOOLTIP_LAYOUTS[direction];
    useFloating({
      targetElement: emptyContent ? null : targetElement,
      floatingPortal,
      floatingElement: hintElement,
      onUpdate: updateHint,
    });

    return emptyContent || !targetElement ? null : (
      <StyledPortal targetElement={targetElement} ref={setFloatingPortal} $flexDirection={layout.flexDirection}>
        <FakeTarget />
        <HintWrapper
          ref={mergedRef}
          $margin={layout.margin}
          $anchorSide={layout.anchorSide}
          $alignSelf={layout.alignSelf}
        >
          <StyledHint role="tooltip" {...props} $dimension={dimension}>
            {children}
          </StyledHint>
        </HintWrapper>
      </StyledPortal>
    );
  },
);

Hint.displayName = 'Hint';
