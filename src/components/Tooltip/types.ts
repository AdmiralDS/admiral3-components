import type { AriaAttributes, CSSProperties, HTMLAttributes, ReactNode, Ref, RefCallback } from 'react';

import type { TOOLTIP_DIMENSIONS } from './constants';
import type { ComponentStyleConfig } from '../../types';
import type {
  HintTooltipAnchorSide,
  HintTooltipInternalPosition,
  HintTooltipPosition,
} from '../_internal/FloatingPortal';

export type TooltipDimension = (typeof TOOLTIP_DIMENSIONS)[number];
export type TooltipPosition = HintTooltipPosition;
export type TooltipInternalPosition = HintTooltipInternalPosition;
export type TooltipAnchorSide = HintTooltipAnchorSide;

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
  /**
   * Элемент, относительно которого позиционируется Tooltip. Если не задан, Tooltip позиционируется
   * относительно элемента-триггера из triggerProps. Не участвует в управлении видимостью:
   * наведение и фокус на этом элементе не открывают и не удерживают Tooltip.
   */
  targetElement?: Element | null;
}

export interface UseTooltipResult<T extends HTMLElement = HTMLElement> {
  /** Признак видимости Tooltip. */
  isVisible: boolean;
  /** Готовые свойства для элемента-триггера, управляющего видимостью Tooltip. */
  triggerProps: {
    ref: RefCallback<T>;
    'aria-describedby': AriaAttributes['aria-describedby'];
  };
  /** Готовые свойства, связывающие Tooltip с элементом позиционирования. */
  tooltipProps: {
    ref: RefCallback<HTMLDivElement>;
    id: string;
    targetElement: Element | null;
  };
}

export interface WithTooltipProps {
  /** Функция, возвращающая содержимое Tooltip. Для передачи параметров используйте замыкание. */
  renderContent: () => ReactNode;
  /** Открывать Tooltip с рекомендуемой задержкой. */
  withDelay?: boolean;
  /** Ref компонента Tooltip. */
  tooltipRef?: Ref<HTMLDivElement>;
  /**
   * Элемент, относительно которого позиционируется Tooltip. Если не задан, Tooltip позиционируется
   * относительно обёрнутого компонента. Не участвует в управлении видимостью Tooltip.
   */
  tooltipTargetElement?: Element | null;
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

export interface StyledTooltipWrapperProps {
  $margin: CSSProperties['margin'];
  $anchorSide: TooltipAnchorSide;
  $alignSelf: CSSProperties['alignSelf'];
}

export interface StyledPortalProps {
  $flexDirection?: CSSProperties['flexDirection'];
}
