import { forwardRef } from 'react';

import { StyledHint } from './style';
import type { HintProps } from './types';

/** Hint primitive component. */
export const Hint = forwardRef<HTMLDivElement, HintProps>(
  ({ children, dimension = 'm', ...props }, ref) => {
    return (
      <StyledHint ref={ref} {...props} $dimension={dimension}>
        {children}
      </StyledHint>
    );
  },
);

Hint.displayName = 'Hint';
