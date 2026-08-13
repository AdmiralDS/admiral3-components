import { INPUT_DIMENSIONS, INPUT_DIMENSION_PARAMETERS } from '../_internal/InputAtoms/constants';

export const TOGGLE_ROOT_DATA_ATTRIBUTE = 'data-admiral-toggle' as const;
export const TOGGLE_DIMENSIONS = INPUT_DIMENSIONS;
export const TOGGLE_LABEL_POSITIONS = ['right', 'left'] as const;

export const TOGGLE_DIMENSION_PARAMETERS = {
  m: {
    ...INPUT_DIMENSION_PARAMETERS.m,
    controlMarginBlock: 0,
    width: 36,
    height: 20,
    thumbSize: 14,
    thumbOffsetInline: 3,
  },
  s: {
    ...INPUT_DIMENSION_PARAMETERS.s,
    controlMarginBlock: 0,
    width: 28,
    height: 16,
    thumbSize: 10,
    thumbOffsetInline: 3,
  },
  xs: {
    ...INPUT_DIMENSION_PARAMETERS.xs,
    controlMarginBlock: 0,
    width: 28,
    height: 16,
    thumbSize: 10,
    thumbOffsetInline: 3,
  },
} as const;
