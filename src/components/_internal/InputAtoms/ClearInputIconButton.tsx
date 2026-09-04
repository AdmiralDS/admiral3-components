import type { ButtonHTMLAttributes } from 'react';

import { ServiceCloseOutline } from '@admiral-ds/admiral3-icons';

import { InputIconButton } from './style';

export type ClearInputIconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;

export const ClearInputIconButton = (props: ClearInputIconButtonProps) => (
  <InputIconButton aria-label="Очистить поле" {...props}>
    <ServiceCloseOutline aria-hidden />
  </InputIconButton>
);
