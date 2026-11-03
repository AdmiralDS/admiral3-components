import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
} from 'react';

import { NativeInput, StyledBaseInputBorder, StyledBaseInputContainer, StyledIconPanel } from './style';
import type { InputProps } from './types';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { isOverflowed } from '../../utils/isOverflowed';
import { refSetter } from '../../utils/refSetter';
import { FormItemContext } from '../_internal/FormItemContext';
import { ClearInputIconButton, clearNativeTextInput, StyledAffix, StyledInputDivider } from '../_internal/InputAtoms';
import { Tooltip } from '../Tooltip/Tooltip';

/** Base text input component. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      appearance = 'standard',
      dimension: dimensionProp = 'm',
      disabled: disabledProp = false,
      readOnly: readOnlyProp = false,
      required: requiredProp = false,
      status: statusProp,
      iconsBefore,
      iconsAfter,
      showClearIcon = false,
      onClear,
      clearButtonProps,
      prefix,
      suffix,
      showAffixDivider = true,
      showTooltip = true,
      containerProps,
      containerRef,
      value,
      defaultValue,
      maxLength: maxLengthProp,
      placeholder,
      onChange,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const formItem = useContext(FormItemContext);
    const dimension = formItem?.dimension ?? dimensionProp;
    const status = formItem?.status ?? statusProp;
    const disabled = formItem?.disabled ?? disabledProp;
    const required = formItem?.required ?? requiredProp;
    const readOnly = formItem?.readOnly ?? readOnlyProp;
    const maxLength = formItem?.maxLength ?? maxLengthProp;
    const onCharacterCountChange = formItem?.onCharacterCountChange;
    const inputRef = useRef<HTMLInputElement>(null);
    const displayClearIcon = showClearIcon && !disabled && !readOnly;
    const hasIconsBefore = hasSlotContent(iconsBefore);
    const hasIconsAfter = hasSlotContent(iconsAfter);
    const hasPrefix = hasSlotContent(prefix);
    const hasSuffix = hasSlotContent(suffix);
    const {
      onPointerDown: onContainerPointerDown,
      onPointerUp: onContainerPointerUp,
      ...restContainerProps
    } = containerProps ?? {};

    const [overflowValue, setOverflowValue] = useState<string | null>(null);
    const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
    const mergedContainerRef = useMemo(() => refSetter(containerRef, setContainerElement), [containerRef]);

    const handleClear = () => {
      const input = inputRef.current;
      if (!input) return;

      clearNativeTextInput(input);
      onClear?.();
    };
    // читает фактическое значение из нативного <input> и передаёт в FormItem только его длину.
    // useCallback нужен, потому что функция используется в зависимостях следующих effects.
    const reportCharacterCount = useCallback(() => {
      const input = inputRef.current;
      if (input) onCharacterCountChange?.(input.value.length);
    }, [onCharacterCountChange]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (value === undefined) {
        onCharacterCountChange?.(event.currentTarget.value.length);
      }
    };

    // Синхронизация счётчика после монтирования и внешнего изменения controlled value:
    // в случаях, когда пользовательский onChange не вызывается.
    // - начальное значение задано через defaultValue;
    // - controlled value изменился извне, например после загрузки данных;
    // - компонент подключился к FormItem уже с заполненным значением.
    useLayoutEffect(() => {
      reportCharacterCount();
    }, [reportCharacterCount, value]);

    // Нативный reset сначала отправляет событие и только затем восстанавливает defaultValue поля.
    // Откладываем чтение значения, чтобы FormItem получил длину уже сброшенного значения.
    useEffect(() => {
      const form = inputRef.current?.form;
      if (!form || !onCharacterCountChange) return;

      let resetTimer: ReturnType<typeof setTimeout> | undefined;
      const handleReset = () => {
        resetTimer = setTimeout(reportCharacterCount);
      };

      form.addEventListener('reset', handleReset);
      return () => {
        form.removeEventListener('reset', handleReset);
        if (resetTimer !== undefined) clearTimeout(resetTimer);
      };
    }, [onCharacterCountChange, reportCharacterCount]);

    // Layout cleanup старого Input выполняется до layout effect нового Input при его замене.
    useLayoutEffect(() => () => onCharacterCountChange?.(0), [onCharacterCountChange]);

    useLayoutEffect(() => {
      const input = inputRef.current;
      if (!input || !containerElement) return;

      // Используем нативные события вместо React onMouseEnter/onMouseLeave из-за известной проблемы SyntheticEvent:
      // mouseenter может не сработать при переходе с disabled-элемента на input.
      // https://github.com/facebook/react/issues/19419
      const handleContainerMouseEnter = () => {
        if (!showTooltip || input.matches(':focus') || !isOverflowed(input)) {
          setOverflowValue(null);
          return;
        }

        setOverflowValue(input.value);
      };
      const clearOverflowValue = () => setOverflowValue(null);

      // При переводе курсора с контейнера на Tooltip срабатывает mouseleave, поэтому Tooltip закрывается и перейти в
      // него невозможно. Для Input это ожидаемо: полный текст доступен в самом поле, где его можно выделить и скопировать.
      containerElement.addEventListener('mouseenter', handleContainerMouseEnter);
      containerElement.addEventListener('mouseleave', clearOverflowValue);
      input.addEventListener('focus', clearOverflowValue);

      return () => {
        containerElement.removeEventListener('mouseenter', handleContainerMouseEnter);
        containerElement.removeEventListener('mouseleave', clearOverflowValue);
        input.removeEventListener('focus', clearOverflowValue);
      };
    }, [containerElement, showTooltip]);

    const handleContainerPointerDown = (event: PointerEvent<HTMLDivElement>) => {
      const iconButton = (event.target as Element).closest('[data-input-icon-button]');
      const input = inputRef.current;
      const inputHasFocus = document.activeElement === input;
      const shouldFocusInput = iconButton && !iconButton.hasAttribute('data-prevent-input-focus');

      if (iconButton && (inputHasFocus || shouldFocusInput)) {
        event.preventDefault();

        if (input && !inputHasFocus && shouldFocusInput) {
          input.focus({ preventScroll: true });
        }
      }

      setOverflowValue(null);
      onContainerPointerDown?.(event);
    };

    const handleContainerPointerUp = (event: PointerEvent<HTMLDivElement>) => {
      const iconButton = (event.target as Element).closest('[data-input-icon-button]');
      const inputHasFocus = document.activeElement === inputRef.current;
      const shouldFocusInput = iconButton && !iconButton.hasAttribute('data-prevent-input-focus');

      if (iconButton && (inputHasFocus || shouldFocusInput)) {
        event.preventDefault();
      }
      onContainerPointerUp?.(event);
    };

    return (
      <>
        <StyledBaseInputContainer
          ref={mergedContainerRef}
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
          data-clear-icon-only={displayClearIcon && !hasIconsAfter && !hasSuffix ? '' : undefined}
          onPointerDown={handleContainerPointerDown}
          onPointerUp={handleContainerPointerUp}
          {...restContainerProps}
        >
          {hasPrefix ? (
            <>
              <StyledAffix data-disabled={disabled ? '' : undefined}>{prefix}</StyledAffix>
              {showAffixDivider && <StyledInputDivider />}
            </>
          ) : null}
          {hasIconsBefore && <StyledIconPanel data-role="icon-panel-before">{iconsBefore}</StyledIconPanel>}
          <NativeInput
            ref={refSetter(inputRef, ref)}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            placeholder={placeholder ?? ' '}
            onChange={handleChange}
            aria-invalid={status === 'error' || ariaInvalid || undefined}
            {...props}
          />
          {(displayClearIcon || hasIconsAfter) && (
            <StyledIconPanel data-role="icon-panel-after" data-clear-icon-only={!hasIconsAfter || undefined}>
              {displayClearIcon && (
                <ClearInputIconButton {...clearButtonProps} data-role="clear-input-button" onClick={handleClear} />
              )}
              {iconsAfter}
            </StyledIconPanel>
          )}
          {hasSuffix ? (
            <>
              {showAffixDivider && <StyledInputDivider />}
              <StyledAffix data-disabled={disabled ? '' : undefined}>{suffix}</StyledAffix>
            </>
          ) : null}
          <StyledBaseInputBorder />
        </StyledBaseInputContainer>
        {showTooltip && hasSlotContent(overflowValue) && (
          <Tooltip targetElement={containerElement}>{overflowValue}</Tooltip>
        )}
      </>
    );
  },
);

Input.displayName = 'Input';
