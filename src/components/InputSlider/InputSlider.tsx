import {
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type InputEvent,
} from 'react';

import { StyledInputSlider } from './style';
import type { InputSliderProps } from './types';
import { refSetter } from '../../utils/refSetter';
import { FormItemContext } from '../_internal/FormItemContext';
import { getSliderMarks, normalizeSliderSelection } from '../_internal/SliderAtoms';
import { Input } from '../Input';
import { Slider } from '../Slider';

const parseNumber = (text: string) => {
  if (text.trim() === '') return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
};

/** Числовое значение с форматируемым текстовым полем и слайдером. */
export const InputSlider = forwardRef<HTMLDivElement, InputSliderProps>(
  (
    {
      dimension: dimensionProp = 'm',
      disabled: disabledProp = false,
      readOnly: readOnlyProp = false,
      status,
      required,
      min: minProp = 0,
      max: maxProp = 100,
      step: stepProp = 1,
      marks,
      value,
      defaultValue,
      onValueChange,
      name,
      form,
      formatValue = String,
      parseValue = parseNumber,
      inputProps = {},
      sliderProps,
      nativeInputRef,
      nativeSliderRef,
      ...props
    },
    ref,
  ) => {
    const formItem = useContext(FormItemContext);
    const dimension = formItem?.dimension ?? dimensionProp;
    const disabled = formItem?.disabled ?? disabledProp;
    const readOnly = formItem?.readOnly ?? readOnlyProp;
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMemo(() => refSetter(inputRef, nativeInputRef), [nativeInputRef]);

    const min = Number.isFinite(minProp) ? minProp : 0;
    const max = Number.isFinite(maxProp) ? Math.max(min, maxProp) : min;
    const points = getSliderMarks(min, max, marks);
    const step = points.length ? null : Number.isFinite(stepProp) && stepProp > 0 ? stepProp : 1;
    const resetValue = defaultValue ?? String(points[0] ?? min);
    const [internalValue, setInternalValue] = useState(resetValue);
    const currentValue = value === undefined ? internalValue : value;
    const currentNumber = parseNumber(currentValue);

    // Текст нужен для промежуточного ввода, например «-» или «10,». Внешнее value имеет приоритет.
    const [draft, setDraft] = useState<{ value: string; text: string } | null>(null);
    if (draft && (draft.value !== currentValue || readOnly)) setDraft(null);
    const text =
      draft && draft.value === currentValue && !readOnly
        ? draft.text
        : currentValue === ''
          ? ''
          : currentNumber === null
            ? currentValue
            : formatValue(currentNumber);
    const parsedValue = text.trim() === '' ? null : parseValue(text);
    const getNumberError = (number: number | null) => {
      if (number === null || !Number.isFinite(number)) return 'Введите число.';
      if (number < min || number > max) return `Введите число от ${min} до ${max}.`;
      if (points.length && !points.includes(number)) return 'Выберите значение из отметок слайдера.';
      return '';
    };
    const validationMessage =
      (text === '' ? '' : getNumberError(parsedValue)) || (currentValue === '' ? '' : getNumberError(currentNumber));
    const invalid = validationMessage !== '';

    // Пустое значение не меняет последнюю принятую позицию ползунка.
    const [lastSliderValue, setLastSliderValue] = useState(currentNumber ?? min);
    const previewValue = points.length
      ? parsedValue !== null && Number.isFinite(parsedValue)
        ? parsedValue
        : null
      : currentNumber;
    if (previewValue !== null && previewValue !== lastSliderValue) {
      setLastSliderValue(previewValue);
    }
    const sliderValue = normalizeSliderSelection(previewValue ?? lastSliderValue, min, max, step, points);

    useLayoutEffect(() => {
      inputRef.current?.setCustomValidity(validationMessage);
    });

    const commitValue = (next: string, nextText: string) => {
      setDraft({ value: next, text: nextText });
      if (value === undefined) setInternalValue(next);
      if (next !== currentValue) onValueChange?.(next);
    };

    const handleInput = (event: InputEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      if (disabled || readOnly || input.matches(':disabled')) return;
      const nextText = input.value;
      const next = nextText.trim() === '' ? null : parseValue(nextText);
      // Валидаторы форм могут читать validity прямо из onValueChange/onInput.
      const error = nextText === '' ? '' : getNumberError(next);
      input.setCustomValidity(error);
      if (!error) {
        commitValue(next === null ? '' : String(next), nextText);
      } else {
        setDraft({ value: currentValue, text: nextText });
      }
      inputProps.onInput?.(event);
    };

    const handleSliderChange = (next: number) => {
      const input = inputRef.current;
      if (!input || disabled || readOnly || input.matches(':disabled')) return;
      const nextText = formatValue(next);
      // required должен видеть новое содержимое до запуска валидаторов потребителя.
      input.value = nextText;
      input.setCustomValidity('');
      commitValue(String(next), nextText);
    };

    const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const number = input.value.trim() === '' ? null : parseValue(input.value);
      if (!disabled && !readOnly && !input.matches(':disabled') && number !== null && Number.isFinite(number)) {
        const next = points.length
          ? normalizeSliderSelection(number, min, max, null, points)
          : Math.min(max, Math.max(min, number));
        if (points.length || next !== number) handleSliderChange(next);
      }
      inputProps.onBlur?.(event);
    };

    useEffect(() => {
      const nativeForm = inputRef.current?.form;
      if (!nativeForm) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const reset = (event: Event) => {
        timer = setTimeout(() => {
          if (event.defaultPrevented) return;
          setDraft(null);
          if (value === undefined) setInternalValue(resetValue);
        });
      };
      nativeForm.addEventListener('reset', reset);
      return () => {
        nativeForm.removeEventListener('reset', reset);
        clearTimeout(timer);
      };
    }, [value, resetValue, form]);

    return (
      <StyledInputSlider ref={ref} {...props}>
        <Input
          {...inputProps}
          ref={mergedRef}
          type="text"
          name={undefined}
          form={form}
          dimension={dimension}
          disabled={disabled}
          readOnly={readOnly}
          status={status}
          required={required}
          value={text}
          aria-invalid={invalid || inputProps['aria-invalid'] || undefined}
          onInput={handleInput}
          onBlur={handleInputBlur}
        />
        <input type="hidden" name={name} form={form} disabled={disabled} value={invalid ? '' : currentValue} />
        {!readOnly && (
          <Slider
            showTooltip
            {...sliderProps}
            dimension={dimension === 'l' ? 'm' : dimension}
            disabled={disabled}
            min={min}
            max={max}
            step={stepProp}
            marks={marks}
            value={sliderValue}
            onChange={handleSliderChange}
            nativeSliderRef={nativeSliderRef}
            nativeSliderProps={{
              'aria-label': inputProps['aria-label'] ?? 'Выбор значения',
              'aria-labelledby': inputProps['aria-labelledby'],
              'aria-describedby': inputProps['aria-describedby'],
              ...sliderProps?.nativeSliderProps,
              name: undefined,
              form,
            }}
          />
        )}
      </StyledInputSlider>
    );
  },
);

InputSlider.displayName = 'InputSlider';
