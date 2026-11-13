import type { CSSProperties } from 'react';

import type { HintTooltipInternalPosition } from './getHintTooltipDirection';

export const HINT_TOOLTIP_ANCHOR_SIDES = ['top', 'right', 'bottom', 'left'] as const;

export type HintTooltipAnchorSide = (typeof HINT_TOOLTIP_ANCHOR_SIDES)[number];

export type HintTooltipLayout = {
  flexDirection: CSSProperties['flexDirection'];
  alignSelf: CSSProperties['alignSelf'];
  fullWidth: boolean;
  margin: CSSProperties['margin'];
  anchorSide: HintTooltipAnchorSide;
};

/** Параметры flex-разметки портала и выравнивания floating-элемента для каждой рассчитанной позиции. */
export const getHintTooltipLayouts = (offset: number) =>
  ({
    leftBottom: {
      flexDirection: 'row-reverse',
      alignSelf: 'flex-start',
      fullWidth: false,
      margin: `0 ${offset}px 0 0`,
      anchorSide: 'right',
    },
    leftTop: {
      flexDirection: 'row-reverse',
      alignSelf: 'flex-end',
      fullWidth: false,
      margin: `0 ${offset}px 0 0`,
      anchorSide: 'right',
    },
    left: {
      flexDirection: 'row-reverse',
      alignSelf: 'center',
      fullWidth: false,
      margin: `0 ${offset}px 0 0`,
      anchorSide: 'right',
    },
    rightBottom: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      fullWidth: false,
      margin: `0 0 0 ${offset}px`,
      anchorSide: 'left',
    },
    rightTop: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      fullWidth: false,
      margin: `0 0 0 ${offset}px`,
      anchorSide: 'left',
    },
    right: {
      flexDirection: 'row',
      alignSelf: 'center',
      fullWidth: false,
      margin: `0 0 0 ${offset}px`,
      anchorSide: 'left',
    },
    topPageCenter: {
      flexDirection: 'column-reverse',
      alignSelf: 'center',
      fullWidth: true,
      margin: `0 0 ${offset}px`,
      anchorSide: 'bottom',
    },
    topLeft: {
      flexDirection: 'column-reverse',
      alignSelf: 'flex-end',
      fullWidth: false,
      margin: `0 0 ${offset}px`,
      anchorSide: 'bottom',
    },
    topRight: {
      flexDirection: 'column-reverse',
      alignSelf: 'flex-start',
      fullWidth: false,
      margin: `0 0 ${offset}px`,
      anchorSide: 'bottom',
    },
    top: {
      flexDirection: 'column-reverse',
      alignSelf: 'center',
      fullWidth: false,
      margin: `0 0 ${offset}px`,
      anchorSide: 'bottom',
    },
    bottomPageCenter: {
      flexDirection: 'column',
      alignSelf: 'center',
      fullWidth: true,
      margin: `${offset}px 0 0`,
      anchorSide: 'top',
    },
    bottomLeft: {
      flexDirection: 'column',
      alignSelf: 'flex-end',
      fullWidth: false,
      margin: `${offset}px 0 0`,
      anchorSide: 'top',
    },
    bottomRight: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
      fullWidth: false,
      margin: `${offset}px 0 0`,
      anchorSide: 'top',
    },
    bottom: {
      flexDirection: 'column',
      alignSelf: 'center',
      fullWidth: false,
      margin: `${offset}px 0 0`,
      anchorSide: 'top',
    },
  }) satisfies Record<HintTooltipInternalPosition, HintTooltipLayout>;
