import type { HTMLAttributes, ReactNode } from 'react';

import type { DROPDOWN_ALIGNMENTS } from './constants';
import type { FloatingWidthMode } from '../_internal/FloatingPortal';

export type DropdownAlignment = (typeof DROPDOWN_ALIGNMENTS)[number];
export type DropdownPosition = 'top' | 'bottom';
export type DropdownWidthMode = FloatingWidthMode;

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Произвольное содержимое Dropdown. */
  children?: ReactNode;
  /** Элемент, относительно которого позиционируется Dropdown. */
  targetElement: Element | null;
  /** Горизонтальное выравнивание относительно targetElement. По умолчанию используется auto. */
  align?: DropdownAlignment;
  /**
   * Определяет способ вычисления ширины Dropdown.
   * В режиме `content` ширина зависит от содержимого Dropdown.
   * В режиме `target` Dropdown принимает ширину `targetElement` и обновляет её при изменении размеров элемента.
   *
   * По умолчанию используется content.
   */
  widthMode?: DropdownWidthMode;
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
