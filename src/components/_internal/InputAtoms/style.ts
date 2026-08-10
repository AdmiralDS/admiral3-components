import styled from 'styled-components';

import { INPUT_DIMENSION_PARAMETERS } from './constants';
import { cssToken } from '../../../theme/cssToken';

const extraTextColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const textDisabled = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);

export const NativeInput = styled.input`
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
  margin-top: ${INPUT_DIMENSION_PARAMETERS.m.labelMarginBlock}px;
  margin-bottom: ${({ $hasExtraText }) => ($hasExtraText ? 0 : INPUT_DIMENSION_PARAMETERS.m.labelMarginBlock)}px;

  &[data-dimension='s'],
  fieldset[data-dimension='s'] & {
    margin-top: ${INPUT_DIMENSION_PARAMETERS.s.labelMarginBlock}px;
    margin-bottom: ${({ $hasExtraText }) => ($hasExtraText ? 0 : INPUT_DIMENSION_PARAMETERS.s.labelMarginBlock)}px;
  }

  &[data-dimension='xs'],
  fieldset[data-dimension='xs'] & {
    margin-top: ${INPUT_DIMENSION_PARAMETERS.xs.labelMarginBlock}px;
    margin-bottom: ${({ $hasExtraText }) => ($hasExtraText ? 0 : INPUT_DIMENSION_PARAMETERS.xs.labelMarginBlock)}px;
  }
`;

export const SelectionControlExtraText = styled.span<{ $disabled: boolean }>`
  color: ${({ $disabled }) => ($disabled ? textDisabled : extraTextColor)};
  margin-top: 4px;
  ${INPUT_DIMENSION_PARAMETERS.m.typography}

  [data-dimension='s'] > &,
  fieldset[data-dimension='s'] & {
    ${INPUT_DIMENSION_PARAMETERS.s.typography}
  }

  [data-dimension='xs'] > &,
  fieldset[data-dimension='xs'] & {
    margin-top: 2px;
    ${INPUT_DIMENSION_PARAMETERS.xs.typography}
  }

  fieldset:disabled & {
    color: ${textDisabled};
  }
`;
