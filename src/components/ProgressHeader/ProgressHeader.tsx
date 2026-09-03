import { forwardRef } from 'react';
import type { CSSProperties } from 'react';

import { ProgressHeaderIndicator, StyledProgressHeader } from './style';
import type { ProgressHeaderProps } from './types';

const progressValueProperty = '--admiral-progress-header-value';

const normalizeValue = (value: number) => {
  if (Number.isNaN(value)) return 0;

  return Math.min(100, Math.max(0, value));
};

type ProgressHeaderStyle = CSSProperties & Record<typeof progressValueProperty, number>;

/** Индикатор прогресса загрузки страницы, закреплённый у верхней границы viewport. */
export const ProgressHeader = forwardRef<HTMLDivElement, ProgressHeaderProps>(
  ({ value, error = false, style, ...props }, ref) => {
    const isIndeterminate = value === undefined;
    const normalizedValue = isIndeterminate ? 0 : normalizeValue(value);
    const progressStyle = {
      ...style,
      [progressValueProperty]: normalizedValue / 100,
    } as ProgressHeaderStyle;

    return (
      <StyledProgressHeader
        ref={ref}
        style={progressStyle}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : normalizedValue}
        {...props}
      >
        <ProgressHeaderIndicator $error={error} $indeterminate={isIndeterminate} aria-hidden="true" />
      </StyledProgressHeader>
    );
  },
);

ProgressHeader.displayName = 'ProgressHeader';
