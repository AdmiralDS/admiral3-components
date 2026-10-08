import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';

import { TOOLTIP_LAYOUTS } from './constants';
import { getTooltipDirection } from './getTooltipDirection';
import { FakeTarget, StyledPortal, TooltipContainer, TooltipWrapper } from './style';
import type { TooltipProps } from './types';
import { getScrollbarSize } from '../../utils/getScrollbarSize';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';
import type { FloatingUpdateContext } from '../_internal/FloatingPortal';
import { useFloating } from '../_internal/FloatingPortal';

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, dimension = 'm', targetElement, tooltipPosition, tooltipStyles, ...props }, ref) => {
    const tooltipElementRef = useRef<HTMLDivElement | null>(null);
    const directionRef = useRef<keyof typeof TOOLTIP_LAYOUTS>('bottom');
    const [direction, setDirection] = useState<keyof typeof TOOLTIP_LAYOUTS>('bottom');

    const emptyContent = !hasSlotContent(children);
    const mergedRef = useMemo(() => refSetter(ref, tooltipElementRef), [ref]);

    const updateTooltip = useCallback(
      ({ floatingElement }: FloatingUpdateContext) => {
        const tooltip = tooltipElementRef.current;
        if (!targetElement || !tooltip) return;

        const scrollbarSize = getScrollbarSize(targetElement.ownerDocument);
        const nextDirection = getTooltipDirection(targetElement, tooltip, scrollbarSize, tooltipPosition);
        const nextLayout = TOOLTIP_LAYOUTS[nextDirection];
        if (nextLayout.fullWidth) {
          floatingElement.style.left = '0px';
          floatingElement.style.width = '100%';
        }
        tooltip.style.opacity = '1';

        if (directionRef.current !== nextDirection) {
          directionRef.current = nextDirection;
          setDirection(nextDirection);
        }
      },
      [targetElement, tooltipPosition],
    );

    const layout = TOOLTIP_LAYOUTS[direction];
    const { floatingPortalRef } = useFloating({
      targetElement: emptyContent ? null : targetElement,
      onUpdate: updateTooltip,
    });

    return emptyContent || !targetElement ? null : (
      <StyledPortal targetElement={targetElement} ref={floatingPortalRef} $flexDirection={layout.flexDirection}>
        <FakeTarget />
        <TooltipWrapper ref={mergedRef} $padding={layout.padding} $alignSelf={layout.alignSelf}>
          <TooltipContainer
            role="tooltip"
            $dimension={dimension}
            $cssMixin={tooltipStyles?.cssMixin}
            className={tooltipStyles?.className}
            style={tooltipStyles?.style}
            {...props}
          >
            {children}
          </TooltipContainer>
        </TooltipWrapper>
      </StyledPortal>
    );
  },
);

Tooltip.displayName = 'Tooltip';
