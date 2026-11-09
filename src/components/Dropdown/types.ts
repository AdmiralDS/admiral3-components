import type { HTMLAttributes, ReactNode } from 'react';

import type { DROPDOWN_ALIGNMENTS } from './constants';

export type DropdownAlignment = (typeof DROPDOWN_ALIGNMENTS)[number];
export type DropdownPosition = 'top' | 'bottom';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Произвольное содержимое Dropdown. */
  children?: ReactNode;
  /** Элемент, относительно которого позиционируется Dropdown. */
  targetElement: Element | null;
  /** Горизонтальное выравнивание относительно targetElement. По умолчанию используется auto. */
  align?: DropdownAlignment;
  /** Вызывается при переходе targetElement из видимого состояния в полностью скрытое за пределами viewport. */
  onTargetDetached?: () => void;
}

export interface DropdownLayout {
  position: DropdownPosition;
  alignSelf: 'flex-start' | 'center' | 'flex-end';
  translateX: number;
  translateY: number;
  targetDetached: boolean;
}
