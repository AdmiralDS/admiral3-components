import type { ButtonHTMLAttributes } from 'react';

import type { ICON_PLACEMENT_DIMENSIONS, ICON_PLACEMENT_APPEARANCES } from './constants';

export type IconPlacementDimension = (typeof ICON_PLACEMENT_DIMENSIONS)[number];
export type IconPlacementAppearance = (typeof ICON_PLACEMENT_APPEARANCES)[number];

export interface IconPlacementProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Размер кнопки */
  dimension?: IconPlacementDimension;
  /** Отключение кнопки */
  disabled?: boolean;
  /** Отключение подсветки */
  disableHighlighter?: boolean;
  /** Позволяет управлять подсветкой в состоянии фокуса, по умолчанию состояние фокуса подсвечивается */
  highlightFocus?: boolean;
  /** Внешний вид кнопки */
  appearance?: IconPlacementAppearance | { iconColor: string };
}

export interface IconPlacementDimensionStyleProps {
  $dimension?: IconPlacementDimension;
}
export interface IconColorStyleProps {
  $iconColor: string;
}
export interface IconPlacementFocusStyleProps {
  $highlightFocus: boolean;
}
export interface IconPlacementContentStyleProps extends IconPlacementDimensionStyleProps, IconColorStyleProps {}
export interface IconPlacementButtonStyleProps extends IconPlacementDimensionStyleProps, IconPlacementFocusStyleProps {}
