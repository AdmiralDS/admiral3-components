import styled from 'styled-components';

import { SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS } from './constants';
import { cssToken } from '../../../theme/cssToken';

const extraTextColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const textDisabled = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);

export const SelectionControlNativeInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: inherit;
`;

export const SelectionControlLabelContent = styled.span<{ $hasExtraText: boolean }>`
  display: flex;
  min-width: 0;
  flex-direction: column;
  margin-top: ${SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.m.labelMarginBlock}px;
  margin-bottom: ${({ $hasExtraText }) =>
    $hasExtraText ? 0 : SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.m.labelMarginBlock}px;

  &[data-dimension='s'],
  fieldset[data-dimension='s'] & {
    margin-top: ${SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.s.labelMarginBlock}px;
    margin-bottom: ${({ $hasExtraText }) =>
      $hasExtraText ? 0 : SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.s.labelMarginBlock}px;
  }

  &[data-dimension='xs'],
  fieldset[data-dimension='xs'] & {
    margin-top: ${SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.xs.labelMarginBlock}px;
    margin-bottom: ${({ $hasExtraText }) =>
      $hasExtraText ? 0 : SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.xs.labelMarginBlock}px;
  }
`;

export const SelectionControlExtraText = styled.span<{ $disabled: boolean }>`
  color: ${({ $disabled }) => ($disabled ? textDisabled : extraTextColor)};
  margin-top: 4px;
  ${SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.m.typography}

  [data-dimension='s'] > &,
  fieldset[data-dimension='s'] & {
    ${SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.s.typography}
  }

  [data-dimension='xs'] > &,
  fieldset[data-dimension='xs'] & {
    margin-top: 2px;
    ${SELECTION_CONTROL_INPUT_DIMENSION_PARAMETERS.xs.typography}
  }

  fieldset:disabled & {
    color: ${textDisabled};
  }
`;
