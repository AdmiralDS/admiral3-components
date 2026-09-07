import {
  SELECTION_CONTROL_INPUT_DIMENSIONS,
  SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS,
} from '../_internal/InputAtoms/constants';

export const TOGGLE_DIMENSIONS = SELECTION_CONTROL_INPUT_DIMENSIONS;
export const TOGGLE_LABEL_POSITIONS = ['right', 'left'] as const;

export const TOGGLE_DIMENSION_PARAMETERS = {
  m: {
    ...SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.m,
    controlMarginBlock: 0,
    width: 36,
    height: 20,
    thumbSize: 14,
    thumbOffsetInline: 2,
    thumbTranslate: 16,
  },
  s: {
    ...SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.s,
    controlMarginBlock: 0,
    width: 28,
    height: 16,
    thumbSize: 10,
    thumbOffsetInline: 2,
    thumbTranslate: 12,
  },
  xs: {
    ...SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.xs,
    controlMarginBlock: 0,
    width: 28,
    height: 16,
    thumbSize: 10,
    thumbOffsetInline: 2,
    thumbTranslate: 12,
  },
} as const;
