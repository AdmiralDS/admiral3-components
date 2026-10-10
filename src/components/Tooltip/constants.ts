import { textStyles } from '@admiral-ds/admiral3-tokens';

import type { HintTooltipPositionConfig } from '../_internal/FloatingPortal';
import {
  HINT_TOOLTIP_INTERNAL_POSITIONS,
  HINT_TOOLTIP_POSITIONS,
  getHintTooltipLayouts,
} from '../_internal/FloatingPortal';

export const TOOLTIP_DIMENSIONS = ['m', 's'] as const;
export const TOOLTIP_POSITIONS = HINT_TOOLTIP_POSITIONS;

export const TOOLTIP_DIMENSION_PARAMETERS = {
  m: { minHeight: 24, padding: '4px 8px', typography: textStyles.body.body2Short },
  s: { minHeight: 20, padding: '2px 6px', typography: textStyles.caption.caption1 },
} as const;

export const DEFAULT_TOOLTIP_POSITION = 'bottom' as const;
export const TOOLTIP_OFFSET = 8;
export const TOOLTIP_INTERNAL_POSITIONS = HINT_TOOLTIP_INTERNAL_POSITIONS;

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

export const TOOLTIP_POSITION_CONFIG: HintTooltipPositionConfig = {
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

/** Параметры flex-разметки портала и выравнивания Tooltip для каждой рассчитанной позиции. */
export const TOOLTIP_LAYOUTS = getHintTooltipLayouts(TOOLTIP_OFFSET);
