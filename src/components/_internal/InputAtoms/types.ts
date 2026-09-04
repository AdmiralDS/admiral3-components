import type { BASE_INPUT_APPEARANCES, BASE_INPUT_DIMENSIONS, BASE_INPUT_STATUSES } from './constants';

export type BaseInputDimension = (typeof BASE_INPUT_DIMENSIONS)[number];
export type BaseInputAppearance = (typeof BASE_INPUT_APPEARANCES)[number];
export type BaseInputStatus = (typeof BASE_INPUT_STATUSES)[number];

export interface StyledBaseInputContainerProps {
  $appearance: BaseInputAppearance;
  $dimension: BaseInputDimension;
  $disabled: boolean;
  $readOnly: boolean;
  $status?: BaseInputStatus;
}
