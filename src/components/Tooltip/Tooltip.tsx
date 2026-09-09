import type { CSSProperties } from 'react';
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { FakeTarget, Portal, TooltipContainer, TooltipWrapper } from './style';
import type { TooltipProps } from './types';
import type { InternalTooltipPositionType } from './utils';
import { getTooltipDirection } from './utils';
import { refSetter } from '../../utils/refSetter';

/**
 * Обычно ширину полосы прокрутки можно вычислить с помощью offsetWidth - clientWidth. Но есть исключение:
 * если на Mac в настройках стоит System Preferences -> General -> Show scroll bars: Automatically based on mouse or trackpad,
 * то полоса прокрутки будет выводиться поверх всего layoutа и результатом вычислений offsetWidth - clientWidth будет 0.
 * Поэтому, если getScrollbarSize будет возвращать 0, буду вместо 0 брать стандартную для Mac ширину полосы прокрутки (16 пикселей)
 * https://gist.github.com/martynchamberlin/6aaf8a45b36907e9f1e21a28889f6b0a
 */
const getScrollbarSize = () => {
  let scrollBarWidth = 0;
  const scrollbox = document.createElement('div');
  scrollbox.textContent = 'scrollbar measurement';
  scrollbox.style.overflow = 'scroll';
  scrollbox.style.fontSize = '14px';
  scrollbox.style.height = '50px';
  scrollbox.style.maxHeight = '50px';
  scrollbox.style.width = '100px';
  scrollbox.style.position = 'absolute';
  scrollbox.style.top = '-100000px';
  scrollbox.style.left = '-100000px';
  document.body.appendChild(scrollbox);
  scrollBarWidth = scrollbox.offsetWidth - scrollbox.clientWidth;
  document.body.removeChild(scrollbox);
  return scrollBarWidth || 16;
};

export const TOOLTIP_DELAY = 1500;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ dimension = 'm', renderContent, targetElement, tooltipPosition, fallbackPositions, ...props }, ref) => {
    const tooltipElementRef = useRef<HTMLDivElement | null>(null);
    const tooltipHeight = useRef(0);

    // Пустая строка, undefined, null и false не будут отображены
    const content = renderContent();
    const emptyContent = !content && content !== 0;

    const [portalFlexDirection, setPortalFlexDirection] = useState<CSSProperties['flexDirection']>();
    const [portalFullWidth, setPortalFullWidth] = useState(false);
    const [recalculation, startRecalculation] = useState({});

    const manageTooltip = useCallback(
      (scrollbarSize: number) => {
        const target = targetElement;
        if (target && tooltipElementRef.current) {
          const direction: InternalTooltipPositionType = getTooltipDirection(
            target as HTMLElement,
            tooltipElementRef.current,
            scrollbarSize,
            tooltipPosition,
            fallbackPositions,
          );
          const tooltip = tooltipElementRef.current;
          switch (direction) {
            case 'leftBottom':
            case 'leftTop':
            case 'left':
              setPortalFlexDirection('row-reverse');
              setPortalFullWidth(false);
              tooltip.style.alignSelf =
                direction === 'leftBottom' ? 'flex-start' : direction === 'leftTop' ? 'flex-end' : 'center';
              break;
            case 'rightBottom':
            case 'rightTop':
            case 'right':
              setPortalFlexDirection('row');
              setPortalFullWidth(false);
              tooltip.style.alignSelf =
                direction === 'rightBottom' ? 'flex-start' : direction === 'rightTop' ? 'flex-end' : 'center';
              break;
            case 'topPageCenter':
            case 'topLeft':
            case 'topRight':
            case 'top':
              setPortalFlexDirection('column-reverse');
              setPortalFullWidth(direction === 'topPageCenter' ? true : false);
              tooltip.style.alignSelf =
                direction === 'topLeft' ? 'flex-end' : direction === 'topRight' ? 'flex-start' : 'center';
              break;
            case 'bottomPageCenter':
            case 'bottomLeft':
            case 'bottomRight':
            case 'bottom':
            default:
              setPortalFlexDirection('column');
              setPortalFullWidth(direction === 'bottomPageCenter' ? true : false);
              tooltip.style.alignSelf =
                direction === 'bottomLeft' ? 'flex-end' : direction === 'bottomRight' ? 'flex-start' : 'center';
          }
        }
      },
      [fallbackPositions, targetElement, tooltipPosition],
    );

    useEffect(() => {
      const scrollbarSize = getScrollbarSize();
      const animationFrame = requestAnimationFrame(() => manageTooltip(scrollbarSize));
      return () => cancelAnimationFrame(animationFrame);
    }, [content, manageTooltip, recalculation]);

    // During fonts loading tooltip size can be changed and tooltip direction should be recalculated
    useLayoutEffect(() => {
      if (tooltipElementRef.current && !emptyContent) {
        const resizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            if (tooltipHeight.current === 0) {
              // don't recalculate tooltip direction on its mount
              tooltipHeight.current = entry.contentRect.height;
            } else if (tooltipHeight.current !== entry.contentRect.height) {
              tooltipHeight.current = entry.contentRect.height;
              startRecalculation({});
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
    }, [emptyContent]);

    return emptyContent ? null : (
      <Portal targetElement={targetElement} $flexDirection={portalFlexDirection} fullContainerWidth={portalFullWidth}>
        <FakeTarget />
        <TooltipWrapper ref={refSetter(ref, tooltipElementRef)}>
          <TooltipContainer role="tooltip" $dimension={dimension} {...props}>
            {content}
          </TooltipContainer>
        </TooltipWrapper>
      </Portal>
    );
  },
);

Tooltip.displayName = 'Tooltip';
