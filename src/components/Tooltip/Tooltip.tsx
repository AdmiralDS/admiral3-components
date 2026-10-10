import { forwardRef, useCallback, useMemo, useState } from 'react';

import { TOOLTIP_LAYOUTS, TOOLTIP_POSITION_CONFIG } from './constants';
import { FakeTarget, StyledPortal, TooltipContainer, TooltipWrapper } from './style';
import type { TooltipProps } from './types';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';
import type { FloatingUpdateContext } from '../_internal/FloatingPortal';
import { getHintTooltipDirection, useFloating } from '../_internal/FloatingPortal';

const stretchToViewportWidth = (floatingElement: HTMLElement) => {
  floatingElement.style.left = '0px';
  floatingElement.style.width = '100%';
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, dimension = 'm', targetElement, tooltipPosition, tooltipStyles, ...props }, ref) => {
    const [floatingPortal, setFloatingPortal] = useState<HTMLDivElement | null>(null);
    const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(null);
    const [direction, setDirection] = useState<keyof typeof TOOLTIP_LAYOUTS>('bottom');

    const emptyContent = !hasSlotContent(children);
    const mergedRef = useMemo(() => refSetter(ref, setTooltipElement), [ref]);

    const updateTooltip = useCallback(
      ({ floatingElement, floatingPortal, targetRect }: FloatingUpdateContext) => {
        if (!targetElement) return;

        const nextDirection = getHintTooltipDirection(
          targetElement,
          targetRect,
          floatingElement,
          tooltipPosition,
          TOOLTIP_POSITION_CONFIG,
        );
        const nextLayout = TOOLTIP_LAYOUTS[nextDirection];
        if (nextLayout.fullWidth) stretchToViewportWidth(floatingPortal);
        // Изначально Tooltip прозрачен и расположен снизу.
        // Показываем его после расчёта размеров и позиции.
        floatingElement.style.opacity = '1';
        setDirection(nextDirection);
      },
      [targetElement, tooltipPosition],
    );

    const layout = TOOLTIP_LAYOUTS[direction];
    useFloating({
      targetElement: emptyContent ? null : targetElement,
      floatingPortal,
      floatingElement: tooltipElement,
      onUpdate: updateTooltip,
    });

    return emptyContent || !targetElement ? null : (
      <StyledPortal targetElement={targetElement} ref={setFloatingPortal} $flexDirection={layout.flexDirection}>
        <FakeTarget />
        <TooltipWrapper
          ref={mergedRef}
          $margin={layout.margin}
          $anchorSide={layout.anchorSide}
          $alignSelf={layout.alignSelf}
        >
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
