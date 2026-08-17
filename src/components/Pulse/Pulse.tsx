import { forwardRef } from 'react';

import { PulseElement } from './style';
import type { PulseProps } from './types';

const DEFAULT_STATUS = 'info';

/** Анимированный индикатор, привлекающий внимание к элементу интерфейса. */
export const Pulse = forwardRef<HTMLDivElement, PulseProps>(
  ({ dimension = 'm', status = DEFAULT_STATUS, ...props }, ref) => {
    const ariaHidden = props['aria-hidden'] ?? (props['aria-label'] || props['aria-labelledby'] ? undefined : true);
    const isCustomStatus = typeof status === 'object';
    const presetStatus = isCustomStatus ? DEFAULT_STATUS : status;
    const colorConfig = isCustomStatus ? status : undefined;

    return (
      <PulseElement
        ref={ref}
        $colorConfig={colorConfig}
        $dimension={dimension}
        $status={presetStatus}
        aria-hidden={ariaHidden}
        {...props}
      />
    );
  },
);

Pulse.displayName = 'Pulse';
