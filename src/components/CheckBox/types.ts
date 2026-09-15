import type { InputHTMLAttributes, ReactNode } from 'react';

import type { CHECK_BOX_DIMENSIONS } from './constants';
import type { FieldSetProps } from '../FieldSet';

/** Размер CheckBox. */
export type CheckBoxDimension = (typeof CHECK_BOX_DIMENSIONS)[number];

export interface CheckBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  /** Подпись справа от CheckBox. */
  children?: ReactNode;
  /** Дополнительный текст под подписью. */
  extraText?: ReactNode;
  /** Размер компонента. Значение по умолчанию — `m`. */
  dimension?: CheckBoxDimension;
  /** Отображает состояние частичного выбора. */
  indeterminate?: boolean;
  /** Отображает ошибку для невыбранного CheckBox. */
  error?: boolean;
}

export interface StyledCheckBoxProps {
  $dimension: CheckBoxDimension;
  $disabled: boolean;
  $readOnly: boolean;
}

export interface CheckBoxGroupProps extends Omit<FieldSetProps, 'defaultValue' | 'onChange'> {
  /** Выбранные значения в управляемом режиме. */
  value?: string[];
  /** Начальные выбранные значения в неуправляемом режиме. */
  defaultValue?: string[];
  /** Обработчик изменения выбранных значений. */
  onChange?: (value: string[]) => void;
  /** Запрещает изменение значений, сохраняя CheckBox доступными для фокуса. */
  readOnly?: boolean;
}
