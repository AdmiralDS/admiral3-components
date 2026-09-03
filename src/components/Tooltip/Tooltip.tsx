import { forwardRef } from 'react';

import { StyledTooltip } from './style';
import type { TooltipProps } from './types';

/** Tooltip primitive component. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, dimension = 'm', ...props }, ref) => {
    return (
      <StyledTooltip ref={ref} {...props} $dimension={dimension}>
        {children}
      </StyledTooltip>
    );
  },
);

Tooltip.displayName = 'Tooltip';
