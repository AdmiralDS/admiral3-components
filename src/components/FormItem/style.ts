import styled, { css } from 'styled-components';

import { FORM_ITEM_DIMENSION_PARAMETERS } from './constants';
import { cssToken } from '../../theme/cssToken';

const secondaryColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const disabledColor = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const errorColor = cssToken('--admiral-color-error-text-1-rest', (theme) => theme.color.error.text._1.rest);
const successColor = cssToken('--admiral-color-success-text-1-rest', (theme) => theme.color.success.text._1.rest);

export const StyledFormItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: ${FORM_ITEM_DIMENSION_PARAMETERS.m.gap}px;

  &[data-dimension='xs'] {
    gap: ${FORM_ITEM_DIMENSION_PARAMETERS.xs.gap}px;
  }
`;

const textStyles = css`
  ${FORM_ITEM_DIMENSION_PARAMETERS.m.typography}
  color: ${secondaryColor};

  ${StyledFormItem}[data-dimension='xs'] > div > & {
    ${FORM_ITEM_DIMENSION_PARAMETERS.xs.typography}
  }

  ${StyledFormItem}[data-disabled] > div > & {
    color: ${disabledColor};
  }
`;

export const StyledLabelRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${FORM_ITEM_DIMENSION_PARAMETERS.m.labelGap}px;

  ${StyledFormItem}[data-dimension='s'] > &,
  ${StyledFormItem}[data-dimension='xs'] > & {
    gap: ${FORM_ITEM_DIMENSION_PARAMETERS.s.labelGap}px;
  }
`;

export const StyledLabel = styled.label<{ $cssMixin?: ReturnType<typeof css> }>`
  ${textStyles}
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
  cursor: pointer;

  ${StyledFormItem}[data-disabled] > ${StyledLabelRow} > & {
    cursor: not-allowed;
  }

  ${StyledFormItem}[data-required] > ${StyledLabelRow} > &::after {
    content: ' *' / '';
    color: ${errorColor};
  }

  &&&& {
    ${(p) => p.$cssMixin}
  }
`;

export const StyledAdditionalLabel = styled.span<{ $cssMixin?: ReturnType<typeof css> }>`
  ${textStyles}
  flex-shrink: 0;
  min-width: 0;
  max-width: 50%;
  overflow-wrap: anywhere;
  cursor: default;
  margin-left: auto;

  &&&& {
    ${(p) => p.$cssMixin}
  }
`;

export const StyledDescription = styled.span<{ $cssMixin?: ReturnType<typeof css> }>`
  ${textStyles}
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;

  ${StyledFormItem}[data-status='error']:not([data-disabled]) > div > & {
    color: ${errorColor};
  }

  ${StyledFormItem}[data-status='success']:not([data-disabled]) > div > & {
    color: ${successColor};
  }

  &&&& {
    ${(p) => p.$cssMixin}
  }
`;

export const StyledAdditionalText = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: default;
  gap: ${FORM_ITEM_DIMENSION_PARAMETERS.m.gap}px;

  ${StyledFormItem}[data-dimension='xs'] > & {
    gap: ${FORM_ITEM_DIMENSION_PARAMETERS.xs.gap}px;
  }
`;

export const StyledCounter = styled.span`
  ${textStyles}
  flex-shrink: 0;
  margin-left: auto;
  white-space: nowrap;

  ${StyledFormItem}:not([data-disabled]) > div > &[data-limit-reached] {
    color: ${errorColor};
  }
`;
