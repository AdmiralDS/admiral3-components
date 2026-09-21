import { forwardRef, useMemo, useRef, useState, type ReactNode } from 'react';

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
import { isOverflowed } from '../../utils/isOverflowed';
import { FormItemContext } from '../_internal/FormItemContext';

function useOverflowTitle<T extends HTMLElement>(content: ReactNode, enabled = false) {
  const ref = useRef<T>(null);
  const [title, setTitle] = useState<string>();

  const handleMouseEnter = () => {
    // TODO: Replace the native title with Tooltip after the Tooltip component is implemented.
    setTitle(enabled && typeof content === 'string' && isOverflowed(ref.current) ? content : undefined);
  };

  const handleMouseLeave = () => setTitle(undefined);

  return { ref, title, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave };
}

/** Подпись и сообщения для одного поля без управления его значением или валидацией. */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  (
    {
      label,
      additionalLabel,
      labelCssMixins,
      visibleLabelTooltips,
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
    const labelOverflowTitleProps = useOverflowTitle<HTMLLabelElement>(label, visibleLabelTooltips?.label);
    const additionalLabelOverflowTitleProps = useOverflowTitle<HTMLSpanElement>(
      additionalLabel,
      visibleLabelTooltips?.additionalLabel,
    );
    const descriptionOverflowTitleProps = useOverflowTitle<HTMLSpanElement>(
      description,
      visibleLabelTooltips?.description,
    );

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
              <StyledLabel htmlFor={htmlFor} $cssMixin={labelCssMixins?.label} {...labelOverflowTitleProps}>
                {label}
              </StyledLabel>
            )}
            {hasAdditionalLabel && (
              <StyledAdditionalLabel $cssMixin={labelCssMixins?.additionalLabel} {...additionalLabelOverflowTitleProps}>
                {additionalLabel}
              </StyledAdditionalLabel>
            )}
          </StyledLabelRow>
        )}
        <FormItemContext.Provider value={contextValue}>{children}</FormItemContext.Provider>
        {(hasDescription || hasCounter) && (
          <StyledAdditionalText>
            {hasDescription && (
              <StyledDescription $cssMixin={labelCssMixins?.description} {...descriptionOverflowTitleProps}>
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
