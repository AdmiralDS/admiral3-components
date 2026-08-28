import type { RADIO_BUTTON_DIMENSIONS } from './constants';
import type { FieldSetProps } from '../FieldSet';

export type RadioButtonDimension = (typeof RADIO_BUTTON_DIMENSIONS)[number];

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Размер RadioButton. Значение по умолчанию 'm'. */
  dimension?: RadioButtonDimension;
  /** Состояние ошибки. */
  error?: boolean;
  /** Отключает RadioButton и запрещает взаимодействие с ним. */
  disabled?: boolean;
  /** Основная подпись RadioButton. */
  children?: React.ReactNode;
  /** Дополнительный текст под основной подписью. */
  extraText?: React.ReactNode;
}

export interface StyledRadioButtonProps {
  $dimension: RadioButtonDimension;
  $disabled: boolean;
  $readOnly: boolean;
}

export interface RadioGroupProps extends Omit<FieldSetProps, 'defaultValue' | 'onChange'> {
  /** Имя группы, которое будет передано всем RadioButton. */
  name?: string;
  /** Выбранное значение в управляемом режиме. */
  value?: string;
  /** Начальное выбранное значение в неуправляемом режиме. */
  defaultValue?: string;
  /** Обработчик выбора нового значения. */
  onChange?: (value: string) => void;
  /** Запрещает изменение значения, сохраняя RadioButton доступными для фокуса. */
  readOnly?: boolean;
}
