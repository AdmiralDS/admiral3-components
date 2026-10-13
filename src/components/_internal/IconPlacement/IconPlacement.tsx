import { forwardRef } from 'react';

import { ServiceCloseOutline } from '@admiral-ds/admiral3-icons';

import { IconPlacementButton } from './style';
import type { IconPlacementProps } from './types';

export const IconPlacement = forwardRef<HTMLButtonElement, IconPlacementProps>(
  ({ type = 'button', dimension = 'm', colorMode = 'colored', children, ...props }, ref) => {
    return (
      <IconPlacementButton {...props} ref={ref} type={type} $colorMode={colorMode} $dimension={dimension}>
        {children}
      </IconPlacementButton>
    );
  },
);

export const CloseIconPlacementButton = forwardRef<HTMLButtonElement, IconPlacementProps>(
  ({ className, ...props }, ref) => {
    return (
      <IconPlacement ref={ref} className={`close-button ${className || ''}`} {...props}>
        <ServiceCloseOutline aria-hidden />
      </IconPlacement>
    );
  },
);
