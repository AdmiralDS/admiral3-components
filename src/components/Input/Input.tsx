import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';

import { NativeInput, StyledBaseInputBorder, StyledBaseInputContainer, StyledIconPanel } from './style';
import type { InputProps } from './types';
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
      value,
      defaultValue,
      onChange,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      onPointerDown,
      title,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const pointerFocusRef = useRef(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const [overflowTitle, setOverflowTitle] = useState<string>();
    const currentValue = value !== undefined ? value : uncontrolledValue;
    const displayClearIcon = showClearIcon && String(currentValue ?? '').length > 0 && !disabled && !readOnly;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setUncontrolledValue(event.currentTarget.value);
      }
      onChange?.(event);
    };

    const handleClear = () => {
      const input = inputRef.current;
      if (!input) return;

      clearNativeTextInput(input);
    };

    const handlePointerDown = (event: PointerEvent<HTMLInputElement>) => {
      pointerFocusRef.current = true;
      onPointerDown?.(event);

      queueMicrotask(() => {
        pointerFocusRef.current = false;
      });
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      if (readOnly && !pointerFocusRef.current) {
        event.currentTarget.select();
      }
      pointerFocusRef.current = false;
      onFocus?.(event);
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

    return (
      <StyledBaseInputContainer
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
      >
        {prefix != null ? (
          <>
            <StyledAffix>{prefix}</StyledAffix>
            {showAffixDivider && <StyledInputDivider />}
          </>
        ) : null}
        {iconsBefore != null && <StyledIconPanel data-role="icon-panel-before">{iconsBefore}</StyledIconPanel>}
        <NativeInput
          ref={refSetter(inputRef, ref)}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          aria-invalid={status === 'error' || ariaInvalid || undefined}
          title={title ?? (showTooltip ? overflowTitle : undefined)}
          {...props}
        />
        {(displayClearIcon || iconsAfter != null) && (
          <StyledIconPanel data-role="icon-panel-after">
            {displayClearIcon && (
              <ClearInputIconButton onPointerDown={(event) => event.preventDefault()} onClick={handleClear} />
            )}
            {iconsAfter}
          </StyledIconPanel>
        )}
        {suffix != null ? (
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
