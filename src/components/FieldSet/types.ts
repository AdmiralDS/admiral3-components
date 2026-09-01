import type { FieldsetHTMLAttributes, ReactNode } from 'react';

import type { FIELDSET_DIMENSIONS, FIELDSET_ORIENTATIONS } from './constants';

/** Размер Fieldset. */
export type FieldSetDimension = (typeof FIELDSET_DIMENSIONS)[number];
/** Ориентация Fieldset (горизонтальная или вертикальная). */
export type FieldSetOrientation = (typeof FIELDSET_ORIENTATIONS)[number];

export interface FieldSetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Заголовок компонента */
  legend?: ReactNode;
  /** Размер компонента */
  dimension?: FieldSetDimension;
  /** Расположение контента по вертикали или горизонтали */
  orientation?: FieldSetOrientation;
  /** Признак обязательности заполнения элементов формы */
  required?: boolean;
  /** Состояние ошибки */
  error?: boolean;
  /** Расстояние между элементами */
  gap?: number | string;
  /** Содержимое компонента. */
  children?: ReactNode;
}

export interface StyledFieldSetProps {
  $dimension: FieldSetDimension;
  $orientation: FieldSetOrientation;
  $gap?: number | string;
}
