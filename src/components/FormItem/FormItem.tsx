import { forwardRef, useMemo, useState } from 'react';

import {
  StyledAdditionalLabel,
  StyledAdditionalText,
  StyledCounter,
  StyledDescription,
  StyledFormItem,
  StyledInputWrapper,
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
      labelPosition = 'top',
      additionalLabel,
      labelStyles,
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
    const isLabelLeft = labelPosition === 'left' && hasLabel;
    const hasAdditionalLabel = hasSlotContent(additionalLabel);
    const hasDescription = hasSlotContent(description);
    const hasCounter = maxLength !== undefined && characterCount >= maxLength * counterThreshold;
    const counterLimitReached = maxLength !== undefined && characterCount >= maxLength;
    const labelNode = hasLabel ? (
      <StyledLabel
        htmlFor={htmlFor}
        className={labelStyles?.label?.className}
        style={labelStyles?.label?.style}
        $cssMixin={labelStyles?.label?.cssMixin}
      >
        {label}
      </StyledLabel>
    ) : null;
    const additionalLabelNode = hasAdditionalLabel ? (
      <StyledAdditionalLabel
        className={labelStyles?.additionalLabel?.className}
        style={labelStyles?.additionalLabel?.style}
        $cssMixin={labelStyles?.additionalLabel?.cssMixin}
      >
        {additionalLabel}
      </StyledAdditionalLabel>
    ) : null;

    return (
      <StyledFormItem
        ref={ref}
        data-dimension={dimension}
        data-label-position={isLabelLeft ? 'left' : undefined}
        data-status={status}
        data-disabled={disabled ? '' : undefined}
        data-required={required ? '' : undefined}
        {...props}
      >
        {isLabelLeft ? (
          <>
            {labelNode}
            {additionalLabelNode}
          </>
        ) : (
          (labelNode || additionalLabelNode) && (
            <StyledLabelRow>
              {labelNode}
              {additionalLabelNode}
            </StyledLabelRow>
          )
        )}
        <StyledInputWrapper>
          <FormItemContext.Provider value={contextValue}>{children}</FormItemContext.Provider>
        </StyledInputWrapper>
        {(hasDescription || hasCounter) && (
          <StyledAdditionalText>
            {hasDescription && (
              <StyledDescription
                className={labelStyles?.description?.className}
                style={labelStyles?.description?.style}
                $cssMixin={labelStyles?.description?.cssMixin}
              >
                {description}
              </StyledDescription>
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
