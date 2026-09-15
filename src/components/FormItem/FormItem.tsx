import { forwardRef } from 'react';

import {
  StyledAdditionalLabel,
  StyledAdditionalText,
  StyledCounter,
  StyledDescription,
  StyledFormItem,
  StyledLabel,
  StyledLabelRow,
} from './style';
import type { FormItemProps } from './types';

/** Подпись и сообщения для одного поля без управления его значением или валидацией. */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  (
    {
      label,
      additionalLabel,
      htmlFor,
      description,
      status,
      counter,
      required = false,
      dimension = 'm',
      children,
      ...props
    },
    ref,
  ) => {
    const hasAdditionalLabel =
      additionalLabel != null && additionalLabel !== false && additionalLabel !== true && additionalLabel !== '';
    const hasDescription = description != null && description !== false && description !== true && description !== '';
    const hasCounter = counter != null && counter !== false && counter !== true && counter !== '';

    return (
      <StyledFormItem ref={ref} $dimension={dimension} data-dimension={dimension} data-status={status} {...props}>
        <StyledLabelRow>
          <StyledLabel htmlFor={htmlFor} $required={required} $dimension={dimension}>
            {label}
          </StyledLabel>
          {hasAdditionalLabel && (
            <StyledAdditionalLabel $dimension={dimension}>{additionalLabel}</StyledAdditionalLabel>
          )}
        </StyledLabelRow>
        {children}
        {(hasDescription || hasCounter) && (
          <StyledAdditionalText>
            {hasDescription && (
              <StyledDescription $dimension={dimension} $status={status}>
                {description}
              </StyledDescription>
            )}
            {hasCounter && <StyledCounter $dimension={dimension}>{counter}</StyledCounter>}
          </StyledAdditionalText>
        )}
      </StyledFormItem>
    );
  },
);

FormItem.displayName = 'FormItem';
