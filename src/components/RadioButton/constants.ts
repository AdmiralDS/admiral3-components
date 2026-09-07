import {
  SELECTION_CONTROL_INPUT_DIMENSIONS,
  SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS,
} from '../_internal/InputAtoms/constants';

export const RADIO_BUTTON_DIMENSIONS = SELECTION_CONTROL_INPUT_DIMENSIONS;

type InputDimensionParameters =
  (typeof SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS)[(typeof SELECTION_CONTROL_INPUT_DIMENSIONS)[number]];

type RadioButtonDimensionParameters = InputDimensionParameters & {
  checkedBorderWidth: number;
};

export const RADIO_BUTTON_DIMENSION_PARAMETERS: Record<
  (typeof RADIO_BUTTON_DIMENSIONS)[number],
  RadioButtonDimensionParameters
> = {
  m: {
    ...SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.m,
    checkedBorderWidth: 5,
  },
  s: {
    ...SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.s,
    checkedBorderWidth: 4,
  },
  xs: {
    ...SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.xs,
    checkedBorderWidth: 3,
  },
};
