import type { ComponentType } from 'react';
import { forwardRef, useCallback } from 'react';

import { Tooltip } from './Tooltip';
import type { WithTooltipProps } from './types';
import { TOOLTIP_DELAY, useTooltip } from './useTooltip';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';

/**
 * Добавляет компоненту стандартное поведение Tooltip.
 *
 * Оборачиваемый компонент должен принимать ref и передавать его корневому HTML-элементу.
 */
export function withTooltip<T extends object>(Component: ComponentType<T>) {
  const ComponentWithTooltip = forwardRef<HTMLElement, T & WithTooltipProps>(
    (
      {
        renderContent,
        withDelay = false,
        tooltipRef,
        tooltipPosition,
        tooltipDimension,
        tooltipStyles,
        ...componentProps
      },
      ref,
    ) => {
      const { isVisible, targetProps, tooltipProps } = useTooltip<HTMLElement>({
        delay: withDelay ? TOOLTIP_DELAY : 0,
      });
      const targetHookRef = targetProps.ref;
      const tooltipHookRef = tooltipProps.ref;

      const mergedTargetRef = useCallback(
        (element: HTMLElement | null) => refSetter(ref, targetHookRef)(element),
        [ref, targetHookRef],
      );
      const mergedTooltipRef = useCallback(
        (element: HTMLDivElement | null) => refSetter(tooltipRef, tooltipHookRef)(element),
        [tooltipRef, tooltipHookRef],
      );
      const content = renderContent();
      const hasContent = hasSlotContent(content);

      const describedBy = [
        (componentProps as { 'aria-describedby'?: string })['aria-describedby'],
        hasContent ? targetProps['aria-describedby'] : undefined,
      ]
        .filter(Boolean)
        .join(' ');
      const wrappedComponentProps = {
        ...componentProps,
        ref: mergedTargetRef,
        'aria-describedby': describedBy || undefined,
      } as T;

      return (
        <>
          <Component {...wrappedComponentProps} />
          {isVisible && hasContent && (
            <Tooltip
              {...tooltipProps}
              ref={mergedTooltipRef}
              dimension={tooltipDimension}
              tooltipPosition={tooltipPosition}
              tooltipStyles={tooltipStyles}
            >
              {content}
            </Tooltip>
          )}
        </>
      );
    },
  );

  return ComponentWithTooltip;
}
