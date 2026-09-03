import type { HTMLAttributes } from 'react';

import type { TOOLTIP_DIMENSIONS } from './constants';

export type TooltipDimension = (typeof TOOLTIP_DIMENSIONS)[number];

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TooltipDimension;
}

export interface StyledTooltipProps {
  $dimension: TooltipDimension;
}
