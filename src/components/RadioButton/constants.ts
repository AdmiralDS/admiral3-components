import { INPUT_DIMENSIONS, INPUT_DIMENSION_PARAMETERS } from '../_internal/InputAtoms/constants';

export const RADIO_BUTTON_DIMENSIONS = INPUT_DIMENSIONS;

type InputDimensionParameters = (typeof INPUT_DIMENSION_PARAMETERS)[(typeof INPUT_DIMENSIONS)[number]];

type RadioButtonDimensionParameters = InputDimensionParameters & {
  checkedBorderWidth: number;
};

export const RADIO_BUTTON_DIMENSION_PARAMETERS: Record<
  (typeof RADIO_BUTTON_DIMENSIONS)[number],
  RadioButtonDimensionParameters
> = {
  m: {
    ...INPUT_DIMENSION_PARAMETERS.m,
    checkedBorderWidth: 5,
  },
  s: {
    ...INPUT_DIMENSION_PARAMETERS.s,
    checkedBorderWidth: 4,
  },
  xs: {
    ...INPUT_DIMENSION_PARAMETERS.xs,
    checkedBorderWidth: 3,
  },
};
