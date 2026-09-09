import type { HTMLAttributes, ReactNode } from 'react';

import type { TOOLTIP_DIMENSIONS } from './constants';

export type TooltipDimension = (typeof TOOLTIP_DIMENSIONS)[number];
export type TooltipPosition = 'bottom' | 'top' | 'left' | 'right';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TooltipDimension;
  /** Функция рендера содержимого Tooltip. */
  renderContent: () => ReactNode;
  /** Элемент, относительно которого позиционируется Tooltip. */
  targetElement: Element | null;
  /** Предпочтительное направление открытия Tooltip. */
  tooltipPosition?: TooltipPosition;
  /**
   * Запасные направления открытия в порядке убывания приоритета.
   * Если tooltipPosition не задан, первое подходящее направление из списка становится основным.
   */
  fallbackPositions?: readonly TooltipPosition[];
}

export interface StyledTooltipProps {
  $dimension: TooltipDimension;
}
