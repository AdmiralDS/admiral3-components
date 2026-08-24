import type { HTMLAttributes } from 'react';

import type { DIVIDER_APPEARANCES, DIVIDER_DIMENSIONS, DIVIDER_ORIENTATIONS } from './constants';

export type DividerDimension = (typeof DIVIDER_DIMENSIONS)[number];
export type DividerAppearance = (typeof DIVIDER_APPEARANCES)[number];
export type DividerOrientation = (typeof DIVIDER_ORIENTATIONS)[number];

/** Пользовательский цвет Divider. */
export interface DividerColorConfig {
  /** Цвет фона Divider. */
  backgroundColor: string;
}

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента, определяет толщину разделителя. Значение по умолчанию 'm'. */
  dimension?: DividerDimension;
  /** Внешний вид компонента или пользовательский цвет. Значение по умолчанию 'default'. */
  appearance?: DividerAppearance | DividerColorConfig;
  /** Ориентация компонента. Значение по умолчанию 'horizontal'. */
  orientation?: DividerOrientation;
  /** Длина компонента. Значение по умолчанию '100%'. */
  length?: string | number;
}

export interface StyledDividerProps {
  $dimension: DividerDimension;
  $appearance: DividerAppearance;
  $colorConfig?: DividerColorConfig;
  $orientation: DividerOrientation;
  $length: string | number;
}
