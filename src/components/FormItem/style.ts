import styled, { css } from 'styled-components';

import { FORM_ITEM_DIMENSION_PARAMETERS } from './constants';
import type {
  FormItemStatus,
  StyledFormItemDescriptionProps,
  StyledFormItemLabelProps,
  StyledFormItemProps,
} from './types';
import { cssToken } from '../../theme/cssToken';

const secondaryColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const disabledColor = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const errorColor = cssToken('--admiral-color-error-text-1-rest', (theme) => theme.color.error.text._1.rest);
const successColor = cssToken('--admiral-color-success-text-1-rest', (theme) => theme.color.success.text._1.rest);

const descriptionColors: Record<FormItemStatus, ReturnType<typeof cssToken>> = {
  error: errorColor,
  success: successColor,
};

export const StyledFormItem = styled.div<StyledFormItemProps>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].gap}px;
`;

export const StyledLabelRow = styled.div<StyledFormItemProps>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].labelGap}px;
`;

export const StyledLabel = styled.label<StyledFormItemLabelProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${({ $disabled, theme }) => ($disabled ? disabledColor : secondaryColor)({ theme })};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  ${({ $required }) =>
    $required &&
    css`
      &::after {
        content: ' *' / '';
        color: ${errorColor};
      }
    `}
`;

export const StyledAdditionalLabel = styled.span<StyledFormItemProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  flex-shrink: 0;
  min-width: 0;
  max-width: 50%;
  overflow-wrap: anywhere;
  color: ${({ $disabled, theme }) => ($disabled ? disabledColor : secondaryColor)({ theme })};
  cursor: default;
  margin-left: auto;
`;

export const StyledDescription = styled.span<StyledFormItemDescriptionProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${({ $disabled, $status, theme }) =>
    ($disabled ? disabledColor : $status ? descriptionColors[$status] : secondaryColor)({ theme })};
`;

export const StyledAdditionalText = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  cursor: default;
`;

export const StyledCounter = styled.span<StyledFormItemProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  flex-shrink: 0;
  color: ${({ $disabled, theme }) => ($disabled ? disabledColor : secondaryColor)({ theme })};
  margin-left: auto;
  white-space: nowrap;
`;
