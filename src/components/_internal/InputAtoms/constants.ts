import { textStyles } from '@admiral-ds/admiral3-tokens';
import type { CSSObject } from 'styled-components';

export const BASE_INPUT_DIMENSIONS = ['l', 'm', 's', 'xs'] as const;
export const BASE_INPUT_APPEARANCES = ['standard', 'flat', 'ghost'] as const;
export const BASE_INPUT_STATUSES = ['error', 'success'] as const;

export const SELECTION_CONTROL_INPUT_DIMENSIONS = [
  'm',
  's',
  'xs',
] as const satisfies readonly (typeof BASE_INPUT_DIMENSIONS)[number][];

export const BASE_INPUT_DIMENSION_PARAMETERS: Record<
  (typeof BASE_INPUT_DIMENSIONS)[number],
  {
    containerHeight: number;
    paddingBlock: number;
    paddingInline: number;
    gap: number;
    iconSize: number;
    dividerLength: number;
    typography: CSSObject;
  }
> = {
  l: {
    containerHeight: 48,
    paddingBlock: 12,
    paddingInline: 16,
    gap: 8,
    iconSize: 24,
    dividerLength: 20,
    typography: textStyles.body.body1Long,
  },
  m: {
    containerHeight: 40,
    paddingBlock: 8,
    paddingInline: 16,
    gap: 8,
    iconSize: 24,
    dividerLength: 20,
    typography: textStyles.body.body1Long,
  },
  s: {
    containerHeight: 32,
    paddingBlock: 6,
    paddingInline: 12,
    gap: 6,
    iconSize: 20,
    dividerLength: 16,
    typography: textStyles.body.body2Long,
  },
  xs: {
    containerHeight: 24,
    paddingBlock: 4,
    paddingInline: 8,
    gap: 6,
    iconSize: 16,
    dividerLength: 12,
    typography: textStyles.caption.caption1,
  },
};

export const SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS: Record<
  (typeof SELECTION_CONTROL_INPUT_DIMENSIONS)[number],
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
