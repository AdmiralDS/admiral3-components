import type { ComponentType, ReactNode, Ref } from 'react';
import { forwardRef, useCallback } from 'react';

import { Tooltip } from './Tooltip';
import type { TooltipDimension, TooltipPosition } from './types';
import { TOOLTIP_DELAY, useTooltip } from './useTooltip';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';

export interface TooltipHocProps {
  /** Функция, возвращающая содержимое Tooltip. Для передачи параметров используйте замыкание. */
  renderContent: () => ReactNode;
  /** Открывать Tooltip с рекомендуемой задержкой. */
  withDelay?: boolean;
  /** Ref компонента Tooltip. */
  tooltipRef?: Ref<HTMLDivElement>;
  /** Предпочтительное направление открытия Tooltip. */
  tooltipPosition?: TooltipPosition;
  /** Размер Tooltip. */
  tooltipDimension?: TooltipDimension;
}

/**
 * Добавляет компоненту стандартное поведение Tooltip.
 *
 * Оборачиваемый компонент должен принимать ref и передавать его корневому HTML-элементу.
 */
export function TooltipHoc<T extends object>(Component: ComponentType<T>) {
  const componentName = Component.displayName || Component.name || 'Component';

  const ComponentWithTooltip = forwardRef<HTMLElement, T & TooltipHocProps>(
    ({ renderContent, withDelay = false, tooltipRef, tooltipPosition, tooltipDimension, ...componentProps }, ref) => {
      const { isVisible, targetProps, tooltipProps } = useTooltip<HTMLElement>({
        delay: withDelay ? TOOLTIP_DELAY : 0,
      });
      const targetHookRef = targetProps.ref;
      const tooltipHookRef = tooltipProps.ref;

      const targetRef = useCallback(
        (element: HTMLElement | null) => refSetter(ref, targetHookRef)(element),
        [ref, targetHookRef],
      );
      const mergedTooltipRef = useCallback(
        (element: HTMLDivElement | null) => refSetter(tooltipHookRef, tooltipRef)(element),
        [tooltipHookRef, tooltipRef],
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
        ref: targetRef,
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
            >
              {content}
            </Tooltip>
          )}
        </>
      );
    },
  );

  ComponentWithTooltip.displayName = `TooltipHoc(${componentName})`;

  return ComponentWithTooltip;
}
