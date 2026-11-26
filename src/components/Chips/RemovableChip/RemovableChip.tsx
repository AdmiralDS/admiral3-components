import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react';

import { CloseIcon } from './style';
import type { RemovableChipProps } from './types';
import { Chip } from '../Chip';

export const RemovableChip = forwardRef<HTMLDivElement, RemovableChipProps>(
  ({ colorMode = 'colored', disabled, readOnly, onClose, onKeyDown, closeButtonProps, ...props }, ref) => {
    const eventsDisabled = disabled || readOnly;

    const handleClickCloseIcon = (e: MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();

      if (!disabled) onClose?.();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      if (e.key === 'Backspace' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose?.();
      }

      onKeyDown?.(e);
    };

    return (
      <Chip
        {...props}
        ref={ref}
        role="button"
        onKeyDown={handleKeyDown}
        disabled={disabled}
        readOnly={readOnly}
        colorMode={colorMode}
        iconsAfter={
          readOnly ? undefined : (
            <CloseIcon
              {...closeButtonProps}
              onClick={handleClickCloseIcon}
              $disabled={disabled}
              $colorMode={colorMode}
            />
          )
        }
      />
    );
  },
);

RemovableChip.displayName = 'RemovableChip';
