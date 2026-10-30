import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import { StyledSliderRange } from './style';
import type { SliderRangeProps } from './types';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';
import {
  normalizeSliderValue,
  SliderScale,
  SliderRangeBase,
  SliderLabel,
  SliderTextRow,
  SliderValue,
} from '../_internal/SliderAtoms';

/** Два нативных ползунка выбора числового интервала без пересечения границ. */
export const SliderRange = forwardRef<HTMLDivElement, SliderRangeProps>(
  (
    {
      dimension = 'm',
      label,
      min: minProp = 0,
      max: maxProp = 100,
      step: stepProp = 1,
      value,
      defaultValue,
      onChange,
      disabled = false,
      showTooltip = false,
      thumbAppearance = 'stroke',
      renderValue = String,
      renderMarks = String,
      lowerNativeSliderProps,
      upperNativeSliderProps,
      lowerNativeSliderRef,
      upperNativeSliderRef,
      ...props
    },
    ref,
  ) => {
    const lowerRef = useRef<HTMLInputElement>(null);
    const upperRef = useRef<HTMLInputElement>(null);
    const mergedLowerRef = useCallback(
      (input: HTMLInputElement | null) => refSetter(lowerRef, lowerNativeSliderRef)(input),
      [lowerNativeSliderRef],
    );
    const mergedUpperRef = useCallback(
      (input: HTMLInputElement | null) => refSetter(upperRef, upperNativeSliderRef)(input),
      [upperNativeSliderRef],
    );

    const min = Number.isFinite(minProp) ? minProp : 0;
    const max = Number.isFinite(maxProp) ? Math.max(min, maxProp) : min;

    const step = Number.isFinite(stepProp) && stepProp > 0 ? stepProp : 1;

    const [internalValue, setInternalValue] = useState(defaultValue ?? [min, max]);
    const source = value ?? internalValue;

    const lower = normalizeSliderValue(source[0], min, max, step);
    const upper = Math.max(lower, normalizeSliderValue(source[1], min, max, step));

    const lowerContent = renderValue?.(lower);
    const upperContent = renderValue?.(upper);
    const hasLowerContent = hasSlotContent(lowerContent);
    const hasUpperContent = hasSlotContent(upperContent);

    const hasLabel = hasSlotContent(label);
    const hasScale = renderMarks !== null;

    const isDisabled = disabled || min === max;

    const selectValue = (selected: number) => {
      if (isDisabled) return;
      const next = normalizeSliderValue(selected, min, max, step);
      const selectLower = selected < (lower + upper) / 2;
      const interval: [number, number] = selectLower ? [Math.min(next, upper), upper] : [lower, Math.max(next, lower)];
      if (interval[0] !== lower || interval[1] !== upper) {
        if (value === undefined) setInternalValue(interval);
        onChange?.(interval);
      }
      (selectLower ? lowerRef : upperRef).current?.focus();
    };

    const handleChange = (next: [number, number]) => {
      if (isDisabled) return;
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    };

    // Обработка нативного reset формы.
    useEffect(() => {
      const form = lowerRef.current?.form;
      if (!form || value !== undefined) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const reset = (event: Event) => {
        timer = setTimeout(() => {
          if (event.defaultPrevented) return;
          setInternalValue(defaultValue ?? [min, max]);
        });
      };
      form.addEventListener('reset', reset);
      return () => {
        form.removeEventListener('reset', reset);
        clearTimeout(timer);
      };
    }, [value, defaultValue, lowerNativeSliderProps?.form, min, max]);

    return (
      <StyledSliderRange
        ref={ref}
        $dimension={dimension}
        data-disabled={disabled ? '' : undefined}
        aria-disabled={disabled ? true : undefined}
        {...props}
      >
        {hasLabel && (
          <SliderTextRow $dimension={dimension} $hasStart={false} $hasEnd={false}>
            <SliderLabel as="span">{label}</SliderLabel>
            {(hasLowerContent || hasUpperContent) && (
              <SliderValue aria-hidden="true">
                {lowerContent}
                {hasLowerContent && hasUpperContent && ' — '}
                {upperContent}
              </SliderValue>
            )}
          </SliderTextRow>
        )}
        <SliderRangeBase
          dimension={dimension}
          appearance={thumbAppearance}
          min={min}
          max={max}
          step={step}
          value={[lower, upper]}
          disabled={disabled}
          showTooltip={showTooltip}
          lowerTooltipContent={hasLowerContent ? lowerContent : String(lower)}
          upperTooltipContent={hasUpperContent ? upperContent : String(upper)}
          lowerNativeSliderRef={mergedLowerRef}
          upperNativeSliderRef={mergedUpperRef}
          lowerNativeSliderProps={lowerNativeSliderProps}
          upperNativeSliderProps={{ ...upperNativeSliderProps, form: lowerNativeSliderProps?.form }}
          onChange={handleChange}
        />
        {hasScale && (
          <SliderScale
            values={[min, max]}
            dimension={dimension}
            min={min}
            max={max}
            renderMarks={renderMarks}
            onSelect={selectValue}
            disabled={disabled}
          />
        )}
      </StyledSliderRange>
    );
  },
);
SliderRange.displayName = 'SliderRange';
