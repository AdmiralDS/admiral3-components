import { ServiceHelpOutline } from '@admiral-ds/admiral3-icons';

import type { InputIconButtonProps } from '../_internal/InputAtoms';
import { InputIconButton } from '../_internal/InputAtoms';

export interface InputIconInformerProps extends Omit<InputIconButtonProps, 'children' | 'preventFocus'> {
  children?: never;
}

// TODO: Подключить Hint к InputIconInformer после реализации компонента Hint.
export const InputIconInformer = (props: InputIconInformerProps) => {
  return (
    <InputIconButton {...props} preventFocus>
      <ServiceHelpOutline aria-hidden />
    </InputIconButton>
  );
};
