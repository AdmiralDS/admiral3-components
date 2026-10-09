import type { CSSProperties } from 'react';

import { textStyles } from '@admiral-ds/admiral3-tokens';

import type { FloatingPositionConfig } from '../_internal/FloatingPortal';
import { FLOATING_INTERNAL_POSITIONS, FLOATING_POSITIONS } from '../_internal/FloatingPortal';

export const TOOLTIP_DIMENSIONS = ['m', 's'] as const;
export const TOOLTIP_POSITIONS = FLOATING_POSITIONS;
export const TOOLTIP_ANCHOR_SIDES = ['top', 'right', 'bottom', 'left'] as const;

export const TOOLTIP_DIMENSION_PARAMETERS = {
  m: { minHeight: 24, padding: '4px 8px', typography: textStyles.body.body2Short },
  s: { minHeight: 20, padding: '2px 6px', typography: textStyles.caption.caption1 },
} as const;

export const DEFAULT_TOOLTIP_POSITION = 'bottom' as const;
export const TOOLTIP_OFFSET = 8;
export const TOOLTIP_INTERNAL_POSITIONS = FLOATING_INTERNAL_POSITIONS;

/** Порядок подбора позиции: сначала с центрированием относительно якоря, затем со смещением. */
const TOOLTIP_POSITION_PRIORITY = [
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

export const TOOLTIP_POSITION_CONFIG: FloatingPositionConfig = {
  positionPriority: TOOLTIP_POSITION_PRIORITY,
  positionPriorityByPosition: {
    bottom: ['bottom', 'bottomRight', 'bottomLeft', 'bottomPageCenter'],
    top: ['top', 'topRight', 'topLeft', 'topPageCenter'],
    left: ['left', 'leftBottom', 'leftTop'],
    right: ['right', 'rightBottom', 'rightTop'],
  },
  fallbackPosition: (position) => position ?? DEFAULT_TOOLTIP_POSITION,
  offset: TOOLTIP_OFFSET,
};

type TooltipLayout = {
  flexDirection: CSSProperties['flexDirection'];
  alignSelf: CSSProperties['alignSelf'];
  fullWidth: boolean;
  margin: CSSProperties['margin'];
  anchorSide: (typeof TOOLTIP_ANCHOR_SIDES)[number];
};

/** Параметры flex-разметки портала и выравнивания Tooltip для каждой рассчитанной позиции. */
export const TOOLTIP_LAYOUTS = {
  leftBottom: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-start',
    fullWidth: false,
    margin: `0 ${TOOLTIP_OFFSET}px 0 0`,
    anchorSide: 'right',
  },
  leftTop: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    fullWidth: false,
    margin: `0 ${TOOLTIP_OFFSET}px 0 0`,
    anchorSide: 'right',
  },
  left: {
    flexDirection: 'row-reverse',
    alignSelf: 'center',
    fullWidth: false,
    margin: `0 ${TOOLTIP_OFFSET}px 0 0`,
    anchorSide: 'right',
  },
  rightBottom: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    fullWidth: false,
    margin: `0 0 0 ${TOOLTIP_OFFSET}px`,
    anchorSide: 'left',
  },
  rightTop: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    fullWidth: false,
    margin: `0 0 0 ${TOOLTIP_OFFSET}px`,
    anchorSide: 'left',
  },
  right: {
    flexDirection: 'row',
    alignSelf: 'center',
    fullWidth: false,
    margin: `0 0 0 ${TOOLTIP_OFFSET}px`,
    anchorSide: 'left',
  },
  topPageCenter: {
    flexDirection: 'column-reverse',
    alignSelf: 'center',
    fullWidth: true,
    margin: `0 0 ${TOOLTIP_OFFSET}px`,
    anchorSide: 'bottom',
  },
  topLeft: {
    flexDirection: 'column-reverse',
    alignSelf: 'flex-end',
    fullWidth: false,
    margin: `0 0 ${TOOLTIP_OFFSET}px`,
    anchorSide: 'bottom',
  },
  topRight: {
    flexDirection: 'column-reverse',
    alignSelf: 'flex-start',
    fullWidth: false,
    margin: `0 0 ${TOOLTIP_OFFSET}px`,
    anchorSide: 'bottom',
  },
  top: {
    flexDirection: 'column-reverse',
    alignSelf: 'center',
    fullWidth: false,
    margin: `0 0 ${TOOLTIP_OFFSET}px`,
    anchorSide: 'bottom',
  },
  bottomPageCenter: {
    flexDirection: 'column',
    alignSelf: 'center',
    fullWidth: true,
    margin: `${TOOLTIP_OFFSET}px 0 0`,
    anchorSide: 'top',
  },
  bottomLeft: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
    fullWidth: false,
    margin: `${TOOLTIP_OFFSET}px 0 0`,
    anchorSide: 'top',
  },
  bottomRight: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    fullWidth: false,
    margin: `${TOOLTIP_OFFSET}px 0 0`,
    anchorSide: 'top',
  },
  bottom: {
    flexDirection: 'column',
    alignSelf: 'center',
    fullWidth: false,
    margin: `${TOOLTIP_OFFSET}px 0 0`,
    anchorSide: 'top',
  },
} satisfies Record<(typeof TOOLTIP_INTERNAL_POSITIONS)[number], TooltipLayout>;
