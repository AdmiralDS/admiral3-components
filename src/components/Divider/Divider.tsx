import { forwardRef } from 'react';

import { StyledDivider } from './style';
import type { DividerProps } from './types';

/** Разделитель контента. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ dimension = 'm', appearance = 'default', orientation = 'horizontal', length = '100%', ...props }, ref) => {
    return (
      <StyledDivider
        ref={ref}
        $dimension={dimension}
        $appearance={appearance}
        $orientation={orientation}
        $length={length}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';
