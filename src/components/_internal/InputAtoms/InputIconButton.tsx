import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { StyledInputIconButton } from './style';

export interface InputIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Prevents the associated input from receiving focus on pointer press. */
  preventFocus?: boolean;
}

export const InputIconButton = forwardRef<HTMLButtonElement, InputIconButtonProps>(
  ({ preventFocus = false, ...props }, ref) => (
    <StyledInputIconButton
      ref={ref}
      data-input-icon-button=""
      data-prevent-input-focus={preventFocus ? '' : undefined}
      {...props}
    />
  ),
);

InputIconButton.displayName = 'InputIconButton';
