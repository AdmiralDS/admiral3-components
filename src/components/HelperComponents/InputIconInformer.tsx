import { forwardRef } from 'react';

import { ServiceHelpOutline } from '@admiral-ds/admiral3-icons';

import type { InputIconButtonProps } from '../_internal/InputAtoms';
import { InputIconButton } from '../_internal/InputAtoms';
import { withHint, type WithHintProps } from '../Hint';

export interface InputIconInformerProps extends Omit<InputIconButtonProps, 'children' | 'preventFocus'>, WithHintProps {
  children?: never;
}

const InputIconButtonWithHint = withHint(InputIconButton);

export const InputIconInformer = forwardRef<HTMLButtonElement, InputIconInformerProps>(
  ({ triggerMode = 'click', ...props }, ref) => {
    return (
      <InputIconButtonWithHint ref={ref} preventFocus triggerMode={triggerMode} {...props}>
        <ServiceHelpOutline aria-hidden />
      </InputIconButtonWithHint>
    );
  },
);

InputIconInformer.displayName = 'InputIconInformer';
