import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';

import { StyledSlider } from './style';
import type { SliderProps } from './types';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';
import {
  segmentedTrackStyles,
  SliderBase,
  SliderControlLayout,
  SliderScale,
  getSliderMarks,
  normalizeSliderSelection,
  SliderBaseContainer,
  SliderLabel,
  SliderTextRow,
  SliderValue,
} from '../_internal/SliderAtoms';

/** Горизонтальный слайдер выбора одного числового значения. */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      dimension = 'm',
      min: minProp = 0,
      max: maxProp = 100,
      step: stepProp = 1,
      marks,
      value,
      defaultValue,
      onChange,
      disabled = false,
      label,
      showTooltip = false,
      thumbAppearance = 'stroke',
      iconStart,
      iconEnd,
      renderValue = String,
      renderMarks = String,
      nativeSliderRef,
      nativeSliderProps,
      ...props
    },
    ref,
  ) => {
    const nativeRef = useRef<HTMLInputElement>(null);
    const mergedInputRef = useMemo(() => refSetter(nativeRef, nativeSliderRef), [nativeSliderRef]);

    const min = Number.isFinite(minProp) ? minProp : 0;
    const max = Number.isFinite(maxProp) ? Math.max(min, maxProp) : min;
    const points = getSliderMarks(min, max, marks);
    const hasMarks = points.length > 0;

    const step = hasMarks ? null : Number.isFinite(stepProp) && stepProp > 0 ? stepProp : 1;

    const [internalValue, setInternalValue] = useState(defaultValue ?? min);
    const currentValue = normalizeSliderSelection(value ?? internalValue, min, max, step, points);
    const position = max > min ? ((currentValue - min) / (max - min)) * 100 : 0;

    const labelId = useId();
    const rangeInputId = nativeSliderProps?.id ?? `${labelId}-input`;
    const hasLabel = hasSlotContent(label);
    const hasScale = renderMarks !== null;
    const hasStart = hasSlotContent(iconStart);
    const hasEnd = hasSlotContent(iconEnd);

    const isDisabled = disabled || min === max;

    const valueContent = renderValue?.(currentValue);

    const labelPoints = [...new Set([min, ...points, max])];

    const handleChange = (selected: number) => {
      if (isDisabled) return;
      const next = normalizeSliderSelection(selected, min, max, step, points);
      if (value === undefined) {
        if (nativeRef.current) nativeRef.current.value = String(next);
        setInternalValue(next);
      }
      if (next !== currentValue) onChange?.(next);
    };

    const selectValue = (selected: number) => {
      if (isDisabled) return;
      handleChange(selected);
      nativeRef.current?.focus();
    };

    // Изменение marks/min/max/step должно обновлять также уже изменённое uncontrolled-поле.
    useEffect(() => {
      const input = nativeRef.current;
      if (value === undefined && input && input.valueAsNumber !== currentValue) input.value = String(currentValue);
    }, [currentValue, value]);

    // Обработка нативного reset формы.
    useEffect(() => {
      const input = nativeRef.current;
      const form = input?.form;
      if (!input || !form || value !== undefined) return;
      let resetTimer: ReturnType<typeof setTimeout> | undefined;
      const reset = (event: Event) => {
        resetTimer = setTimeout(() => {
          if (!event.defaultPrevented) setInternalValue(input.valueAsNumber);
        });
      };
      form.addEventListener('reset', reset);
      return () => {
        form.removeEventListener('reset', reset);
        clearTimeout(resetTimer);
      };
    }, [value, nativeSliderProps?.form]);

    return (
      <StyledSlider
        ref={ref}
        $dimension={dimension}
        aria-disabled={disabled ? true : undefined}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        {hasLabel && (
          <SliderTextRow $dimension={dimension} $hasStart={hasStart} $hasEnd={hasEnd}>
            <SliderLabel id={labelId} htmlFor={rangeInputId}>
              {label}
            </SliderLabel>
            {hasSlotContent(valueContent) && <SliderValue aria-hidden="true">{valueContent}</SliderValue>}
          </SliderTextRow>
        )}
        <SliderControlLayout dimension={dimension} iconStart={iconStart} iconEnd={iconEnd}>
          <SliderBaseContainer $dimension={dimension}>
            <SliderBase
              id={rangeInputId}
              ref={mergedInputRef}
              dimension={dimension}
              appearance={thumbAppearance}
              min={min}
              max={max}
              step={step ?? 'any'}
              allowedValues={step === null ? points : undefined}
              trackStyles={hasMarks ? segmentedTrackStyles : undefined}
              segmentPositions={labelPoints.map((point) => (max > min ? (point - min) / (max - min) : 0))}
              value={value === undefined ? undefined : currentValue}
              defaultValue={
                value === undefined ? normalizeSliderSelection(defaultValue ?? min, min, max, step, points) : undefined
              }
              position={position}
              disabled={disabled}
              showTooltip={showTooltip}
              tooltipContent={hasSlotContent(valueContent) ? valueContent : String(currentValue)}
              onValueChange={handleChange}
              aria-labelledby={
                nativeSliderProps?.['aria-labelledby'] ??
                (nativeSliderProps?.['aria-label'] === undefined && hasLabel ? labelId : undefined)
              }
              aria-valuemin={hasMarks ? points[0] : nativeSliderProps?.['aria-valuemin']}
              aria-valuemax={hasMarks ? points[points.length - 1] : nativeSliderProps?.['aria-valuemax']}
              tabIndex={disabled ? -1 : 0}
              {...nativeSliderProps}
            />
          </SliderBaseContainer>
        </SliderControlLayout>
        {hasScale && (
          <SliderScale
            dimension={dimension}
            hasStart={hasStart}
            hasEnd={hasEnd}
            values={labelPoints}
            min={min}
            max={max}
            currentValue={hasMarks ? currentValue : undefined}
            renderMarks={renderMarks}
            onSelect={selectValue}
            disabled={disabled}
          />
        )}
      </StyledSlider>
    );
  },
);
Slider.displayName = 'Slider';
