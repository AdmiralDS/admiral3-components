import type { HTMLAttributes } from 'react';

import { ServiceHelpOutline } from '@admiral-ds/admiral3-icons';

import { InputIcon } from '../_internal/InputAtoms';

export interface InputIconInformerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  children?: never;
}

// TODO: Подключить Hint к InputIconInformer после реализации компонента Hint.
export const InputIconInformer = (props: InputIconInformerProps) => {
  return (
    <InputIcon {...props}>
      <ServiceHelpOutline aria-hidden />
    </InputIcon>
  );
};
