import { forwardRef, useMemo, useState } from 'react';

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
import { FormItemContext } from '../_internal/FormItemContext';

/** Подпись и сообщения для одного поля без управления его значением или валидацией. */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  (
    {
      label,
      additionalLabel,
      labelCssMixins,
      htmlFor,
      description,
      status,
      maxLength,
      counterThreshold = 0.8,
      required = false,
      disabled = false,
      dimension = 'm',
      readOnly = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [characterCount, setCharacterCount] = useState(0);
    const contextValue = useMemo(
      () => ({
        dimension,
        status,
        disabled,
        required,
        readOnly,
        maxLength,
        onCharacterCountChange: maxLength === undefined ? undefined : setCharacterCount,
      }),
      [dimension, status, disabled, required, readOnly, maxLength],
    );
    const hasLabel = hasSlotContent(label);
    const hasAdditionalLabel = hasSlotContent(additionalLabel);
    const hasDescription = hasSlotContent(description);
    const hasCounter = maxLength !== undefined && characterCount >= maxLength * counterThreshold;
    const counterLimitReached = maxLength !== undefined && characterCount >= maxLength;

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
            {hasLabel && (
              <StyledLabel htmlFor={htmlFor} $cssMixin={labelCssMixins?.label}>
                {label}
              </StyledLabel>
            )}
            {hasAdditionalLabel && (
              <StyledAdditionalLabel $cssMixin={labelCssMixins?.additionalLabel}>
                {additionalLabel}
              </StyledAdditionalLabel>
            )}
          </StyledLabelRow>
        )}
        <FormItemContext.Provider value={contextValue}>{children}</FormItemContext.Provider>
        {(hasDescription || hasCounter) && (
          <StyledAdditionalText>
            {hasDescription && (
              <StyledDescription $cssMixin={labelCssMixins?.description}>{description}</StyledDescription>
            )}
            {hasCounter && (
              <StyledCounter data-limit-reached={counterLimitReached ? '' : undefined}>
                {characterCount} / {maxLength}
              </StyledCounter>
            )}
          </StyledAdditionalText>
        )}
      </StyledFormItem>
    );
  },
);

FormItem.displayName = 'FormItem';
