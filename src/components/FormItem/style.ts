import styled from 'styled-components';

import { FORM_ITEM_DIMENSION_PARAMETERS } from './constants';
import type {
  FormItemStatus,
  StyledFormItemDescriptionProps,
  StyledFormItemLabelProps,
  StyledFormItemProps,
} from './types';
import { cssToken } from '../../theme/cssToken';

const secondaryColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const errorColor = cssToken('--admiral-color-error-text-1-rest', (theme) => theme.color.error.text._1.rest);
const successColor = cssToken('--admiral-color-success-text-1-rest', (theme) => theme.color.success.text._1.rest);

const descriptionColors: Record<FormItemStatus, ReturnType<typeof cssToken>> = {
  error: errorColor,
  success: successColor,
};

export const StyledFormItem = styled.div<StyledFormItemProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].gap}px;
`;

export const StyledLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledLabel = styled.label<StyledFormItemLabelProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  color: ${secondaryColor};
  cursor: pointer;

  ${({ $required }) => $required && `&::after { content: ' *' / ''; color: ${errorColor}; }`}
`;

export const StyledAdditionalLabel = styled.span<StyledFormItemProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  color: ${secondaryColor};
  cursor: default;
  margin-left: auto;
`;

export const StyledDescription = styled.span<StyledFormItemDescriptionProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  color: ${({ $status, theme }) => ($status ? descriptionColors[$status] : secondaryColor)({ theme })};
`;

export const StyledAdditionalText = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  cursor: default;
`;

export const StyledCounter = styled.span<StyledFormItemProps>`
  ${({ $dimension }) => FORM_ITEM_DIMENSION_PARAMETERS[$dimension].typography}
  color: ${secondaryColor};
  margin-left: auto;
  white-space: nowrap;
`;
