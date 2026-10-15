import type { HTMLAttributes, SyntheticEvent } from 'react';

import type { ChipDimension, SelectableChipProps } from '../types';

interface FilterChipsBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Размер FilterChips.Item по умолчанию 'm'. Самостоятельным SelectableChip размер задаётся отдельно. */
  dimension?: ChipDimension;
  /** Расстояние между дочерними элементами в пикселях. */
  gap?: number;
  /** Отключает FilterChips.Item; на остальные дочерние элементы не влияет. */
  disabled?: boolean;
}

interface FilterChipsExclusiveProps {
  /** Включает одиночный(radio) выбор. */
  exclusive: true;
  /** Управляемое значение: value выбранного FilterChips.Item либо null. */
  value?: string | null;
  /** Начальное значение при отсутствии value. Последующие изменения пропса не меняют выбор. */
  defaultValue?: string | null;
  /** Вызывается с новым значением в управляемом и неконтролируемом режимах. */
  onChange?: (event: SyntheticEvent<HTMLDivElement>, value: string | null) => void;
}

interface FilterChipsMultipleProps {
  exclusive?: false;
  /** Управляемые значения: value выбранных FilterChips.Item. */
  value?: string[];
  /** Начальные значения при отсутствии value. Последующие изменения пропса не меняют выбор. */
  defaultValue?: string[];
  /** Вызывается с новым набором значений в управляемом и неконтролируемом режимах. */
  onChange?: (event: SyntheticEvent<HTMLDivElement>, value: string[]) => void;
}

/**
 * Группа с клавиатурной навигацией только между FilterChips.Item.
 * Без value выбор FilterChips.Item хранится внутри группы; defaultValue задаёт начальное значение.
 * Остальные children отображаются без изменений и самостоятельно управляют своим состоянием и фокусом.
 */
export type FilterChipsProps = FilterChipsBaseProps & (FilterChipsExclusiveProps | FilterChipsMultipleProps);

export interface FilterChipsItemProps extends Omit<
  SelectableChipProps,
  'selected' | 'onSelectedChange' | 'role' | 'tabIndex' | 'aria-pressed' | 'aria-selected' | 'aria-disabled'
> {
  /** Значение выбора, уникальное внутри группы. */
  value: string;
}
