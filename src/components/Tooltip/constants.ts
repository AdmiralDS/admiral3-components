import type { CSSProperties } from 'react';

import { textStyles } from '@admiral-ds/admiral3-tokens';

export const TOOLTIP_DIMENSIONS = ['m', 's'] as const;
export const TOOLTIP_POSITIONS = ['bottom', 'top', 'left', 'right'] as const;

export const TOOLTIP_WRAPPER_PADDING = 8;
export const TOOLTIP_DELAY = 1500;

export const TOOLTIP_DIMENSION_PARAMETERS = {
  m: { minHeight: 24, padding: '4px 8px', typography: textStyles.body.body2Short },
  s: { minHeight: 20, padding: '2px 6px', typography: textStyles.caption.caption1 },
} as const;

export const DEFAULT_TOOLTIP_POSITION = 'bottom' as const;
export const TOOLTIP_INTERNAL_POSITIONS = [
  ...TOOLTIP_POSITIONS,
  'bottomRight',
  'bottomLeft',
  'topRight',
  'topLeft',
  'leftBottom',
  'leftTop',
  'rightBottom',
  'rightTop',
  'bottomPageCenter',
  'topPageCenter',
] as const;

/** Допустимые варианты смещения тултипа для каждого заданного направления. */
export const COMPATIBLE_POSITIONS: Record<
  (typeof TOOLTIP_POSITIONS)[number],
  readonly (typeof TOOLTIP_INTERNAL_POSITIONS)[number][]
> = {
  bottom: ['bottom', 'bottomRight', 'bottomLeft', 'bottomPageCenter'],
  top: ['top', 'topRight', 'topLeft', 'topPageCenter'],
  left: ['left', 'leftBottom', 'leftTop'],
  right: ['right', 'rightBottom', 'rightTop'],
};

/** Порядок подбора позиции: сначала с центрированием относительно якоря, затем со смещением. */
export const POSITION_PRIORITY = [
  'bottom',
  'top',
  'left',
  'right',
  'bottomRight',
  'bottomLeft',
  'topRight',
  'topLeft',
  'leftBottom',
  'leftTop',
  'rightBottom',
  'rightTop',
  'bottomPageCenter',
  'topPageCenter',
] as const satisfies readonly (typeof TOOLTIP_INTERNAL_POSITIONS)[number][];

type TooltipLayout = {
  flexDirection: CSSProperties['flexDirection'];
  alignSelf: CSSProperties['alignSelf'];
  fullWidth: boolean;
};

/** Параметры flex-разметки портала и выравнивания Tooltip для каждой рассчитанной позиции. */
export const TOOLTIP_LAYOUTS = {
  leftBottom: { flexDirection: 'row-reverse', alignSelf: 'flex-start', fullWidth: false },
  leftTop: { flexDirection: 'row-reverse', alignSelf: 'flex-end', fullWidth: false },
  left: { flexDirection: 'row-reverse', alignSelf: 'center', fullWidth: false },
  rightBottom: { flexDirection: 'row', alignSelf: 'flex-start', fullWidth: false },
  rightTop: { flexDirection: 'row', alignSelf: 'flex-end', fullWidth: false },
  right: { flexDirection: 'row', alignSelf: 'center', fullWidth: false },
  topPageCenter: { flexDirection: 'column-reverse', alignSelf: 'center', fullWidth: true },
  topLeft: { flexDirection: 'column-reverse', alignSelf: 'flex-end', fullWidth: false },
  topRight: { flexDirection: 'column-reverse', alignSelf: 'flex-start', fullWidth: false },
  top: { flexDirection: 'column-reverse', alignSelf: 'center', fullWidth: false },
  bottomPageCenter: { flexDirection: 'column', alignSelf: 'center', fullWidth: true },
  bottomLeft: { flexDirection: 'column', alignSelf: 'flex-end', fullWidth: false },
  bottomRight: { flexDirection: 'column', alignSelf: 'flex-start', fullWidth: false },
  bottom: { flexDirection: 'column', alignSelf: 'center', fullWidth: false },
} satisfies Record<(typeof TOOLTIP_INTERNAL_POSITIONS)[number], TooltipLayout>;
