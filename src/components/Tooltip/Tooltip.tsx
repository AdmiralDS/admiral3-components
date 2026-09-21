import type { CSSProperties } from 'react';
import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { TOOLTIP_LAYOUTS } from './constants';
import { getTooltipDirection } from './getTooltipDirection';
import { FakeTarget, StyledPortal, TooltipContainer, TooltipWrapper } from './style';
import type { TooltipProps } from './types';
import { getScrollbarSize } from '../../utils/getScrollbarSize';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, dimension = 'm', targetElement, tooltipPosition, ...props }, ref) => {
    const tooltipElementRef = useRef<HTMLDivElement | null>(null);
    const tooltipSize = useRef<{ width: number; height: number } | undefined>(undefined);

    const [portalFlexDirection, setPortalFlexDirection] = useState<CSSProperties['flexDirection']>();
    const [portalFullWidth, setPortalFullWidth] = useState(false);
    const [recalculationKey, setRecalculationKey] = useState(0);

    const emptyContent = !hasSlotContent(children);
    const targetDocument = targetElement?.ownerDocument;
    const mergedRef = useMemo(() => refSetter(ref, tooltipElementRef), [ref]);

    const manageTooltip = useCallback(
      (scrollbarSize: number) => {
        const tooltip = tooltipElementRef.current;
        if (targetElement && tooltip) {
          const direction = getTooltipDirection(targetElement, tooltip, scrollbarSize, tooltipPosition);
          const layout = TOOLTIP_LAYOUTS[direction];
          setPortalFlexDirection(layout.flexDirection);
          setPortalFullWidth(layout.fullWidth);
          tooltip.style.alignSelf = layout.alignSelf;
        }
      },
      [targetElement, tooltipPosition],
    );

    useEffect(() => {
      if (!targetElement || !tooltipElementRef.current || emptyContent) return;

      const scrollbarSize = getScrollbarSize(targetDocument);
      const animationFrame = requestAnimationFrame(() => manageTooltip(scrollbarSize));
      return () => cancelAnimationFrame(animationFrame);
    }, [children, emptyContent, manageTooltip, recalculationKey, targetDocument, targetElement]);

    useLayoutEffect(() => {
      if (tooltipElementRef.current && !emptyContent) {
        const resizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            const previousSize = tooltipSize.current;
            tooltipSize.current = { width, height };
            if (previousSize && (previousSize.width !== width || previousSize.height !== height)) {
              setRecalculationKey((value) => value + 1);
            }
          });
        });
        resizeObserver.observe(tooltipElementRef.current);
        return () => {
          resizeObserver.disconnect();
        };
      }
    }, [emptyContent]);

    // First container render always happens downward and transparent,
    // after size and position settled transparency returns to normal
    useEffect(() => {
      if (tooltipElementRef.current && !emptyContent) {
        tooltipElementRef.current.style.opacity = '1';
      }
    }, [children, emptyContent]);

    return emptyContent || !targetElement ? null : (
      <StyledPortal
        targetElement={targetElement}
        $flexDirection={portalFlexDirection}
        fullContainerWidth={portalFullWidth}
      >
        <FakeTarget />
        <TooltipWrapper ref={mergedRef}>
          <TooltipContainer role="tooltip" $dimension={dimension} {...props}>
            {children}
          </TooltipContainer>
        </TooltipWrapper>
      </StyledPortal>
    );
  },
);

Tooltip.displayName = 'Tooltip';
