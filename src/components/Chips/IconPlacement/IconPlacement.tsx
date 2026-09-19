import { forwardRef } from 'react';

import { ServiceCloseOutline } from '@admiral-ds/admiral3-icons';

import { ActivityHighlighter, IconPlacementButton, IconPlacementContent } from './style';
import type { IconPlacementProps } from './types';

export const IconPlacement = forwardRef<HTMLButtonElement, IconPlacementProps>(
  (
    {
      type = 'button',
      dimension = 'lBig',
      disabled = false,
      highlightFocus = true,
      appearance,
      disableHighlighter = false,
      children,
      ...props
    },
    ref,
  ) => {
    const iconColor = typeof appearance === 'object' ? appearance.iconColor || 'secondary' : appearance || 'secondary';
    return (
      <IconPlacementButton
        ref={ref}
        type={type}
        $dimension={dimension}
        disabled={disabled}
        $highlightFocus={highlightFocus}
        {...props}
      >
        {!disableHighlighter && <ActivityHighlighter $dimension={dimension} aria-hidden />}
        <IconPlacementContent $dimension={dimension} $iconColor={iconColor} aria-hidden>
          {children}
        </IconPlacementContent>
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
