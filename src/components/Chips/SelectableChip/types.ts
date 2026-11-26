import type { ChipBaseProps } from '../types';

export interface SelectableChipProps extends Omit<ChipBaseProps, 'disabled' | 'readOnly'> {
  /** Выбранное состояние чипса. */
  selected?: boolean;
  /** Отключённое состояние. Блокирует onClick, onKeyDown и onSelectedChange. */
  disabled?: boolean;
  /** Режим только для чтения. Блокирует onClick, onKeyDown и onSelectedChange. */
  readOnly?: boolean;
  /** Обработчик изменения выбранного состояния при клике или нажатии Enter/Space. */
  onSelectedChange?: (selected: boolean) => void;
}
