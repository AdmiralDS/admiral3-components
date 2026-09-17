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
import { hasSlotContent } from '../../utils/hasSlotContent';

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
      disabled = false,
      dimension = 'm',
      children,
      ...props
    },
    ref,
  ) => {
    const hasLabel = hasSlotContent(label);
    const hasAdditionalLabel = hasSlotContent(additionalLabel);
    const hasDescription = hasSlotContent(description);
    const hasCounter = hasSlotContent(counter);

    return (
      <StyledFormItem
        ref={ref}
        $dimension={dimension}
        data-dimension={dimension}
        data-status={status}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        {(hasLabel || hasAdditionalLabel) && (
          <StyledLabelRow $dimension={dimension}>
            {hasLabel && (
              <StyledLabel htmlFor={htmlFor} $required={required} $dimension={dimension} $disabled={disabled}>
                {label}
              </StyledLabel>
            )}
            {hasAdditionalLabel && (
              <StyledAdditionalLabel $dimension={dimension} $disabled={disabled}>
                {additionalLabel}
              </StyledAdditionalLabel>
            )}
          </StyledLabelRow>
        )}
        {children}
        {(hasDescription || hasCounter) && (
          <StyledAdditionalText>
            {hasDescription && (
              <StyledDescription $dimension={dimension} $status={status} $disabled={disabled}>
                {description}
              </StyledDescription>
            )}
            {hasCounter && (
              <StyledCounter $dimension={dimension} $disabled={disabled}>
                {counter}
              </StyledCounter>
            )}
          </StyledAdditionalText>
        )}
      </StyledFormItem>
    );
  },
);

FormItem.displayName = 'FormItem';
