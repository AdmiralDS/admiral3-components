import { forwardRef } from 'react';

import { StyledFieldSet, StyledLegend } from './style';
import type { FieldSetProps } from './types';

const DEFAULT_DIMENSION = 'm';
const DEFAULT_ORIENTATION = 'vertical';

/** Компонент FieldSet предназначен для группировки элементов формы. */
export const FieldSet = forwardRef<HTMLFieldSetElement, FieldSetProps>(
  (
    {
      children,
      legend,
      dimension = DEFAULT_DIMENSION,
      orientation = DEFAULT_ORIENTATION,
      gap,
      required = false,
      error = false,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const dataRequired = required ? '' : undefined;
    return (
      <StyledFieldSet
        ref={ref}
        $dimension={dimension}
        $orientation={orientation}
        $gap={gap}
        data-dimension={dimension}
        data-orientation={orientation}
        data-required={dataRequired}
        aria-invalid={error || ariaInvalid || undefined}
        {...props}
      >
        {legend != null && <StyledLegend>{legend}</StyledLegend>}
        {children}
      </StyledFieldSet>
    );
  },
);

FieldSet.displayName = 'FieldSet';
