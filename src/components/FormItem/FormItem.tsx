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
        data-dimension={dimension}
        data-status={status}
        data-disabled={disabled ? '' : undefined}
        data-required={required ? '' : undefined}
        {...props}
      >
        {(hasLabel || hasAdditionalLabel) && (
          <StyledLabelRow>
            {hasLabel && <StyledLabel htmlFor={htmlFor}>{label}</StyledLabel>}
            {hasAdditionalLabel && <StyledAdditionalLabel>{additionalLabel}</StyledAdditionalLabel>}
          </StyledLabelRow>
        )}
        {children}
        {(hasDescription || hasCounter) && (
          <StyledAdditionalText>
            {hasDescription && <StyledDescription>{description}</StyledDescription>}
            {hasCounter && <StyledCounter>{counter}</StyledCounter>}
          </StyledAdditionalText>
        )}
      </StyledFormItem>
    );
  },
);

FormItem.displayName = 'FormItem';
