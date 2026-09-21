import type { AriaAttributes, HTMLAttributes, ReactNode, RefCallback } from 'react';

import type { TOOLTIP_DIMENSIONS, TOOLTIP_INTERNAL_POSITIONS, TOOLTIP_POSITIONS } from './constants';

export type TooltipDimension = (typeof TOOLTIP_DIMENSIONS)[number];
export type TooltipPosition = (typeof TOOLTIP_POSITIONS)[number];
export type TooltipInternalPosition = (typeof TOOLTIP_INTERNAL_POSITIONS)[number];

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TooltipDimension;
  /** Содержимое Tooltip. */
  children?: ReactNode;
  /** Элемент, относительно которого позиционируется Tooltip. */
  targetElement: Element | null;
  /** Предпочтительное направление открытия Tooltip. */
  tooltipPosition?: TooltipPosition;
}

export interface UseTooltipOptions {
  /** Задержка открытия Tooltip при наведении в миллисекундах. Рекомендуемое значение — TOOLTIP_DELAY. */
  delay?: number;
}

export interface UseTooltipResult<T extends HTMLElement> {
  /** Признак видимости Tooltip. */
  isVisible: boolean;
  /** Готовые свойства для элемента, относительно которого позиционируется Tooltip. */
  targetProps: {
    ref: RefCallback<T>;
    'aria-describedby': AriaAttributes['aria-describedby'];
  };
  /** Готовые свойства, связывающие Tooltip с целевым элементом. */
  tooltipProps: {
    ref: RefCallback<HTMLDivElement>;
    id: string;
    targetElement: T | null;
  };
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
