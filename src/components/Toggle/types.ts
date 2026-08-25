import type { TOGGLE_DIMENSIONS, TOGGLE_LABEL_POSITIONS } from './constants';

export type ToggleDimension = (typeof TOGGLE_DIMENSIONS)[number];
export type ToggleLabelPosition = (typeof TOGGLE_LABEL_POSITIONS)[number];

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Размер Toggle. Значение по умолчанию 'm'. */
  dimension?: ToggleDimension;
  /** Запрещает изменение значения пользователем, сохраняя компонент доступным для фокуса. */
  readOnly?: boolean;
  /** Основная подпись Toggle. */
  children?: React.ReactNode;
  /** Дополнительный текст под основной подписью. */
  extraText?: React.ReactNode;
  /** Расположение подписи относительно переключателя. */
  labelPosition?: ToggleLabelPosition;
  /** Ширина Toggle. */
  width?: number | string;
}

export interface StyledToggleProps {
  $disabled: boolean;
  $readOnly: boolean;
  $labelPosition: ToggleLabelPosition;
  $width?: number | string;
}
