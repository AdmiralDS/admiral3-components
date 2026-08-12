import { textStyles } from '@admiral-ds/admiral3-tokens';
import type { CSSObject } from 'styled-components';

export const LIST_DIMENSIONS = ['m', 's', 'xs'] as const;
export const ORDERED_LIST_TYPE = ['numbers', 'lower-letters', 'upper-letters'] as const;
export const UNORDERED_LIST_TYPE = ['bullet', 'virgule', 'icon'] as const;

export const LIST_GAP = 8;

export const LIST_DIMENSION_PARAMETERS: Record<
  (typeof LIST_DIMENSIONS)[number],
  { markerSize: number; gap: number; typography: CSSObject }
> = {
  m: { markerSize: 24, gap: 8, typography: textStyles.body.body1Long },
  s: { markerSize: 20, gap: 6, typography: textStyles.body.body2Long },
  xs: { markerSize: 16, gap: 6, typography: textStyles.caption.caption1 },
};
