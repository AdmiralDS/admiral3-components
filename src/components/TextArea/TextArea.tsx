import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type PointerEvent,
} from 'react';

import { NativeTextArea, TextAreaActionPanel, TextAreaContainer } from './style';
import type { TextAreaProps } from './types';
import { refSetter } from '../../utils/refSetter';
import { FormItemContext } from '../_internal/FormItemContext';
import { ClearInputIconButton, clearNativeTextInput, StyledBaseInputBorder } from '../_internal/InputAtoms';
import { InputIconCopyButton } from '../HelperComponents/InputIconCopyButton';

/** Нативное многострочное поле ввода. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      dimension: dimensionProp = 'm',
      appearance = 'standard',
      status: statusProp,
      disabled: disabledProp = false,
      readOnly: readOnlyProp = false,
      required: requiredProp = false,
      maxLength: maxLengthProp,
      rows = 2,
      minRows = rows,
      maxRows,
      autoHeight = false,
      resize = false,
      showClearIcon = false,
      showCopyIcon = false,
      clearButtonProps,
      copyButtonProps,
      onClear,
      containerProps,
      containerRef,
      value,
      defaultValue,
      onChange,
      placeholder,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const formItem = useContext(FormItemContext);
    const dimension = formItem?.dimension ?? dimensionProp;
    const status = formItem?.status ?? statusProp;
    const disabled = formItem?.disabled ?? disabledProp;
    const readOnly = formItem?.readOnly ?? readOnlyProp;
    const required = formItem?.required ?? requiredProp;
    const maxLength = formItem?.maxLength ?? maxLengthProp;
    const onCharacterCountChange = formItem?.onCharacterCountChange;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const minimumRows = Math.max(1, Math.floor(minRows));
    const maximumRows = maxRows === undefined ? undefined : Math.max(minimumRows, Math.floor(maxRows));
    const copyVisible = showCopyIcon && !disabled;
    const clearVisible = showClearIcon && !showCopyIcon && !disabled && !readOnly;
    const { onPointerDown, onPointerUp, ...restContainerProps } = containerProps ?? {};

    const updateHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoHeight) return;
      // Сброс высоты позволяет уменьшить поле после удаления текста. CSS ограничивает min/max-height.
      textarea.style.height = '0px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, [autoHeight]);

    const reportCharacterCount = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea) onCharacterCountChange?.(textarea.value.length);
    }, [onCharacterCountChange]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      // uncontrolled
      if (value === undefined) {
        reportCharacterCount();
        updateHeight();
      }
    };

    // controlled
    useLayoutEffect(() => {
      reportCharacterCount();
      updateHeight();
    }, [
      reportCharacterCount,
      updateHeight,
      value,
      minimumRows,
      maximumRows,
      dimension,
      placeholder,
      copyVisible,
      clearVisible,
    ]);

    // clean up on unmounting
    useLayoutEffect(() => {
      return () => {
        onCharacterCountChange?.(0);
      };
    }, [onCharacterCountChange]);

    // обновление высоты при изменении ширины при autoHeight
    useLayoutEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoHeight) return;
      let previousWidth = textarea.getBoundingClientRect().width;
      const observer = new ResizeObserver(() => {
        const width = textarea.getBoundingClientRect().width;
        if (width !== previousWidth) {
          previousWidth = width;
          updateHeight();
        }
      });
      observer.observe(textarea);
      return () => {
        observer.disconnect();
        textarea.style.removeProperty('height');
      };
    }, [autoHeight, updateHeight]);

    // обновление счетчика и высоты после нативного сброса формы через reset
    useEffect(() => {
      const form = textareaRef.current?.form;
      if (!form || (!autoHeight && !onCharacterCountChange)) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const handleReset = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          reportCharacterCount();
          updateHeight();
        });
      };
      form.addEventListener('reset', handleReset);
      return () => {
        form.removeEventListener('reset', handleReset);
        clearTimeout(timer);
      };
    }, [autoHeight, onCharacterCountChange, reportCharacterCount, updateHeight]);

    const handleClear = () => {
      if (textareaRef.current) {
        clearNativeTextInput(textareaRef.current);
        onClear?.();
      }
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      const button = (event.target as Element).closest('[data-input-icon-button]');
      const textarea = textareaRef.current;
      if (button && textarea) {
        event.preventDefault();
        const activeElement = textarea.ownerDocument.activeElement;
        if (activeElement !== textarea && !(copyVisible && activeElement === button)) {
          textarea.focus({ preventScroll: true });
        }
      }
      onPointerDown?.(event);
    };

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
      if ((event.target as Element).closest('[data-input-icon-button]')) event.preventDefault();
      onPointerUp?.(event);
    };

    return (
      <TextAreaContainer
        ref={containerRef}
        $appearance={appearance}
        $dimension={dimension}
        $status={status}
        $disabled={disabled}
        $readOnly={readOnly}
        data-appearance={appearance}
        data-dimension={dimension}
        data-status={status}
        data-disabled={disabled ? '' : undefined}
        data-read-only={readOnly ? '' : undefined}
        data-action={copyVisible || clearVisible ? '' : undefined}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        {...restContainerProps}
      >
        <NativeTextArea
          ref={refSetter(textareaRef, ref)}
          $minRows={minimumRows}
          $maxRows={maximumRows}
          $resize={resize && !autoHeight && !disabled}
          rows={Math.max(minimumRows, Math.min(rows, maximumRows ?? rows))}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder || ' '}
          onChange={handleChange}
          aria-invalid={status === 'error' || ariaInvalid || undefined}
          {...props}
        />
        {(copyVisible || clearVisible) && (
          <TextAreaActionPanel data-role="text-area-action">
            {copyVisible ? (
              <InputIconCopyButton inputRef={textareaRef} {...copyButtonProps} />
            ) : (
              <ClearInputIconButton {...clearButtonProps} onClick={handleClear} />
            )}
          </TextAreaActionPanel>
        )}
        <StyledBaseInputBorder />
      </TextAreaContainer>
    );
  },
);

TextArea.displayName = 'TextArea';
