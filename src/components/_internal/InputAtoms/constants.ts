import { textStyles } from '@admiral-ds/admiral3-tokens';
import type { CSSObject } from 'styled-components';

export const INPUT_DIMENSIONS = ['m', 's', 'xs'] as const;

export const INPUT_DIMENSION_PARAMETERS: Record<
  (typeof INPUT_DIMENSIONS)[number],
  {
    controlSize: number;
    controlMarginBlock: number;
    labelMarginBlock: number;
    gap: number;
    typography: CSSObject;
  }
> = {
  m: {
    controlSize: 20,
    controlMarginBlock: 2,
    labelMarginBlock: 2,
    gap: 10,
    typography: textStyles.body.body1Short,
  },
  s: {
    controlSize: 16,
    controlMarginBlock: 2,
    labelMarginBlock: 2,
    gap: 8,
    typography: textStyles.body.body2Short,
  },
  xs: {
    controlSize: 14,
    controlMarginBlock: 1,
    labelMarginBlock: 0,
    gap: 8,
    typography: textStyles.caption.caption1,
  },
};
