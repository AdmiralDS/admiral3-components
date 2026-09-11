import { forwardRef, useId } from 'react';

import { PROGRESS_PAGE_VALUE_PROPERTY } from './constants';
import { Label, Labels, ProgressPageIndicator, ProgressPageTrack, StyledProgressPage, ValueLabel } from './style';
import type { ProgressPageProps } from './types';

const DEFAULT_APPEARANCE = 'primary';

const normalizeValue = (value: number) => {
  if (Number.isNaN(value)) return 0;

  return Math.min(100, Math.max(0, value));
};

/** Компонент для отображения прогресса загрузки страницы, либо контента на странице. */
export const ProgressPage = forwardRef<HTMLDivElement, ProgressPageProps>(
  (
    {
      value,
      error = false,
      label,
      valueLabel,
      appearance = DEFAULT_APPEARANCE,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-valuetext': ariaValueText,
      ...props
    },
    ref,
  ) => {
    const indeterminate = value === undefined;
    const normalizedValue = indeterminate ? 0 : normalizeValue(value);
    const progressIndicatorStyle = {
      [PROGRESS_PAGE_VALUE_PROPERTY]: `${normalizedValue}%`,
    };

    const isCustomAppearance = typeof appearance === 'object';
    const colorConfig = isCustomAppearance ? appearance : undefined;

    const generatedLabelId = useId();
    const progressLabelledBy =
      ariaLabelledBy ?? (ariaLabel === undefined && label != null ? generatedLabelId : undefined);

    return (
      <StyledProgressPage ref={ref} data-appearance={isCustomAppearance ? 'custom' : appearance} {...props}>
        {(label != null || valueLabel != null) && (
          <Labels>
            {label != null && <Label id={generatedLabelId}>{label}</Label>}
            {valueLabel != null && <ValueLabel>{valueLabel}</ValueLabel>}
          </Labels>
        )}
        <ProgressPageTrack
          $colorConfig={colorConfig}
          role="progressbar"
          aria-label={ariaLabel}
          aria-labelledby={progressLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? undefined : normalizedValue}
          aria-valuetext={ariaValueText}
        >
          <ProgressPageIndicator
            $error={error}
            $indeterminate={indeterminate}
            $colorConfig={colorConfig}
            style={progressIndicatorStyle}
            aria-hidden="true"
          />
        </ProgressPageTrack>
      </StyledProgressPage>
    );
  },
);

ProgressPage.displayName = 'ProgressPage';
