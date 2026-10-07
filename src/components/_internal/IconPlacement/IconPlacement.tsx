import { forwardRef, type KeyboardEvent } from 'react';

import { ServiceCloseOutline } from '@admiral-ds/admiral3-icons';

import { IconPlacementButton } from './style';
import type { IconPlacementProps } from './types';

export const IconPlacement = forwardRef<HTMLButtonElement, IconPlacementProps>(
  ({ type = 'button', dimension = 'm', colorMode = 'colored', children, ...props }, ref) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (props.disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        props.onKeyDown?.(e);
      }
    };

    return (
      <IconPlacementButton
        {...props}
        ref={ref}
        type={type}
        $colorMode={colorMode}
        $dimension={dimension}
        onKeyDown={handleKeyDown}
      >
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
