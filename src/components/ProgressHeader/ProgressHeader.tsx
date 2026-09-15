import { forwardRef } from 'react';

import { PROGRESS_HEADER_VALUE_PROPERTY } from './constants';
import { ProgressHeaderIndicator, StyledProgressHeader } from './style';
import type { ProgressHeaderProps } from './types';

const DEFAULT_APPEARANCE = 'primary';

const normalizeValue = (value: number) => {
  if (Number.isNaN(value)) return 0;

  return Math.min(100, Math.max(0, value));
};

/** Индикатор прогресса загрузки страницы, закреплённый у верхней границы viewport. */
export const ProgressHeader = forwardRef<HTMLDivElement, ProgressHeaderProps>(
  ({ value, error = false, appearance = DEFAULT_APPEARANCE, style, ...props }, ref) => {
    const isIndeterminate = value === undefined;
    const normalizedValue = isIndeterminate ? 0 : normalizeValue(value);
    const progressStyle = {
      ...style,
      [PROGRESS_HEADER_VALUE_PROPERTY]: normalizedValue / 100,
    };
    const isCustomAppearance = typeof appearance === 'object';
    const colorConfig = isCustomAppearance ? appearance : undefined;

    return (
      <StyledProgressHeader
        ref={ref}
        $colorConfig={colorConfig}
        data-appearance={isCustomAppearance ? 'custom' : appearance}
        style={progressStyle}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : normalizedValue}
        {...props}
      >
        <ProgressHeaderIndicator
          $error={error}
          $indeterminate={isIndeterminate}
          $colorConfig={colorConfig}
          aria-hidden="true"
        />
      </StyledProgressHeader>
    );
  },
);

ProgressHeader.displayName = 'ProgressHeader';
