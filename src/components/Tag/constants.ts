import { textStyles } from '@admiral-ds/admiral3-tokens';
import type { CSSObject } from 'styled-components';

export const TAG_DIMENSIONS = ['l', 'm', 's', 'xs'] as const;
export const TAG_STATUSES = ['neutral', 'info', 'success', 'error', 'warning', 'attention'] as const;

interface TagDimensionParameters {
  height: number;
  paddingBlock: number;
  paddingInline: number;
  iconSize: number;
  typography: CSSObject;
}

export const TAG_DIMENSION_PARAMETRS = {
  l: {
    height: 32,
    paddingBlock: 5,
    paddingInline: 11,
    iconSize: 20,
    typography: textStyles.body.body2Long,
  },
  m: {
    height: 24,
    paddingBlock: 3,
    paddingInline: 7,
    iconSize: 16,
    typography: textStyles.caption.caption1,
  },
  s: {
    height: 20,
    paddingBlock: 1,
    paddingInline: 5,
    iconSize: 16,
    typography: textStyles.caption.caption1,
  },
  xs: {
    height: 16,
    paddingBlock: 0,
    paddingInline: 5,
    iconSize: 16,
    typography: textStyles.caption.caption1,
  },
} as const satisfies Record<(typeof TAG_DIMENSIONS)[number], TagDimensionParameters>;
