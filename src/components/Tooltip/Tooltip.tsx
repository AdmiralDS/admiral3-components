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
  ({ children, dimension = 'm', targetElement, tooltipPosition, tooltipStyles, ...props }, ref) => {
    const tooltipElementRef = useRef<HTMLDivElement | null>(null);
    const tooltipSize = useRef<{ width: number; height: number } | undefined>(undefined);

    const [portalFlexDirection, setPortalFlexDirection] = useState<CSSProperties['flexDirection']>();
    const [portalFullWidth, setPortalFullWidth] = useState(false);
    const [recalculationKey, setRecalculationKey] = useState(0);

    const emptyContent = !hasSlotContent(children);
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

      const targetDocument = targetElement.ownerDocument;
      const targetWindow = targetDocument.defaultView;
      if (!targetWindow) return;

      const scrollbarSize = getScrollbarSize(targetDocument);
      const animationFrame = targetWindow.requestAnimationFrame(() => manageTooltip(scrollbarSize));
      return () => targetWindow.cancelAnimationFrame(animationFrame);
    }, [children, emptyContent, manageTooltip, recalculationKey, targetElement]);

    useLayoutEffect(() => {
      const tooltipElement = tooltipElementRef.current;
      const ResizeObserverConstructor = tooltipElement?.ownerDocument.defaultView?.ResizeObserver;

      if (tooltipElement && ResizeObserverConstructor && !emptyContent) {
        const resizeObserver = new ResizeObserverConstructor((entries) => {
          entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            const previousSize = tooltipSize.current;
            tooltipSize.current = { width, height };
            if (previousSize && (previousSize.width !== width || previousSize.height !== height)) {
              setRecalculationKey((value) => value + 1);
            }
          });
        });
        resizeObserver.observe(tooltipElement);
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
