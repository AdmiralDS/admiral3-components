import { forwardRef, useRef, useState, type MouseEvent, type PointerEvent } from 'react';

import { NativeInput, StyledBaseInputBorder, StyledBaseInputContainer, StyledIconPanel } from './style';
import type { InputProps } from './types';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { isOverflowed } from '../../utils/isOverflowed';
import { refSetter } from '../../utils/refSetter';
import { ClearInputIconButton, clearNativeTextInput, StyledAffix, StyledInputDivider } from '../_internal/InputAtoms';

/** Base text input component. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      appearance = 'standard',
      dimension = 'm',
      disabled = false,
      readOnly = false,
      status,
      iconsBefore,
      iconsAfter,
      showClearIcon = false,
      prefix,
      suffix,
      showAffixDivider = true,
      showTooltip = true,
      containerProps,
      containerRef,
      value,
      defaultValue,
      placeholder,
      onMouseEnter,
      onMouseLeave,
      title,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [overflowTitle, setOverflowTitle] = useState<string>();
    const displayClearIcon = showClearIcon && !disabled && !readOnly;
    const hasIconsBefore = hasSlotContent(iconsBefore);
    const hasIconsAfter = hasSlotContent(iconsAfter);
    const hasPrefix = hasSlotContent(prefix);
    const hasSuffix = hasSlotContent(suffix);
    const { onPointerDown: onContainerPointerDown, ...restContainerProps } = containerProps ?? {};

    const handleClear = () => {
      const input = inputRef.current;
      if (!input) return;

      clearNativeTextInput(input);
    };

    const handleMouseEnter = (event: MouseEvent<HTMLInputElement>) => {
      // TODO: Replace the native title with Tooltip after the Tooltip component is implemented.
      if (title === undefined && showTooltip && isOverflowed(event.currentTarget)) {
        setOverflowTitle(event.currentTarget.value);
      } else {
        setOverflowTitle(undefined);
      }
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: MouseEvent<HTMLInputElement>) => {
      setOverflowTitle(undefined);
      onMouseLeave?.(event);
    };

    const handleContainerPointerDown = (event: PointerEvent<HTMLDivElement>) => {
      const iconButton = (event.target as Element).closest('[data-input-icon-button]');

      if (iconButton && !iconButton.hasAttribute('data-prevent-input-focus')) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      onContainerPointerDown?.(event);
    };

    return (
      <StyledBaseInputContainer
        ref={containerRef}
        $appearance={appearance}
        $dimension={dimension}
        $disabled={disabled}
        $readOnly={readOnly}
        $status={status}
        data-appearance={appearance}
        data-dimension={dimension}
        data-disabled={disabled ? '' : undefined}
        data-read-only={readOnly ? '' : undefined}
        data-status={status}
        onPointerDown={handleContainerPointerDown}
        {...restContainerProps}
      >
        {hasPrefix ? (
          <>
            <StyledAffix>{prefix}</StyledAffix>
            {showAffixDivider && <StyledInputDivider />}
          </>
        ) : null}
        {hasIconsBefore && <StyledIconPanel data-role="icon-panel-before">{iconsBefore}</StyledIconPanel>}
        <NativeInput
          ref={refSetter(inputRef, ref)}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder ?? ' '}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-invalid={status === 'error' || ariaInvalid || undefined}
          title={title ?? (showTooltip ? overflowTitle : undefined)}
          {...props}
        />
        {(displayClearIcon || hasIconsAfter) && (
          <StyledIconPanel data-role="icon-panel-after" data-clear-only={!hasIconsAfter || undefined}>
            {displayClearIcon && <ClearInputIconButton data-role="clear-input-button" onClick={handleClear} />}
            {iconsAfter}
          </StyledIconPanel>
        )}
        {hasSuffix ? (
          <>
            {showAffixDivider && <StyledInputDivider />}
            <StyledAffix>{suffix}</StyledAffix>
          </>
        ) : null}
        <StyledBaseInputBorder />
      </StyledBaseInputContainer>
    );
  },
);

Input.displayName = 'Input';
