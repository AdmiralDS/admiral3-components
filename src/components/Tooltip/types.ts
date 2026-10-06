import type { AriaAttributes, HTMLAttributes, ReactNode, Ref, RefCallback } from 'react';

import type { TOOLTIP_DIMENSIONS, TOOLTIP_INTERNAL_POSITIONS, TOOLTIP_POSITIONS } from './constants';
import type { ComponentStyleConfig } from '../../types';

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
  /** Пользовательские стили Tooltip. */
  tooltipStyles?: ComponentStyleConfig;
}

export interface UseTooltipOptions {
  /** Задержка открытия Tooltip при наведении в миллисекундах. Рекомендуемое значение — TOOLTIP_DELAY. */
  delay?: number;
}

export interface UseTooltipResult<T extends HTMLElement = HTMLElement> {
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

export interface WithTooltipProps {
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
  /** Пользовательские стили Tooltip. */
  tooltipStyles?: ComponentStyleConfig;
}

export interface StyledTooltipProps {
  $dimension: TooltipDimension;
  $cssMixin?: ComponentStyleConfig['cssMixin'];
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
