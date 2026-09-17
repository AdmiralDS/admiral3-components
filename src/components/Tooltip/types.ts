import type { HTMLAttributes, ReactNode } from 'react';

import type { TOOLTIP_DIMENSIONS, TOOLTIP_INTERNAL_POSITIONS, TOOLTIP_POSITIONS } from './constants';

export type TooltipDimension = (typeof TOOLTIP_DIMENSIONS)[number];
export type TooltipPosition = (typeof TOOLTIP_POSITIONS)[number];
export type TooltipInternalPosition = (typeof TOOLTIP_INTERNAL_POSITIONS)[number];

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TooltipDimension;
  /** Функция рендера содержимого Tooltip. */
  renderContent: () => ReactNode;
  /** Элемент, относительно которого позиционируется Tooltip. */
  targetElement: Element | null;
  /** Предпочтительное направление открытия Tooltip. */
  tooltipPosition?: TooltipPosition;
}

export interface StyledTooltipProps {
  $dimension: TooltipDimension;
}

/** Типы, используемые при расчёте и проверке позиции Tooltip. */
export type PositionContext = {
  spaceTop: number;
  spaceRight: number;
  spaceBottom: number;
  spaceLeft: number;
  viewportWidth: number;
  anchorWidth: number;
  anchorHeight: number;
  tooltipWidth: number;
  tooltipHeight: number;
};

export type PositionCheck = (context: PositionContext) => boolean;
