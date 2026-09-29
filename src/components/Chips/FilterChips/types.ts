import type { HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

import type { ChipDimension, ChipsProps } from '../types';

interface FilterChipsBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Размер FilterChips.Item по умолчанию 'm'. Обычным Chips размер задаётся отдельно. */
  dimension?: ChipDimension;
  /** Расстояние между Chips в пикселях. */
  gap?: number;
  /** Отключает FilterChips.Item; на остальные дочерние элементы не влияет. */
  disabled?: boolean;
}

interface FilterChipsExclusiveProps {
  /** Включает одиночный(radio) выбор. */
  exclusive: true;
  /** Управляемое значение: id элемента или его содержимое, если id не задан; либо null. */
  value?: string | null;
  /** Начальное значение при отсутствии value. Последующие изменения пропса не меняют выбор. */
  defaultValue?: string | null;
  /** Вызывается с новым значением в управляемом и неконтролируемом режимах. */
  onChange?: (event: SyntheticEvent<HTMLDivElement>, value: string | null) => void;
}

interface FilterChipsMultipleProps {
  exclusive?: false;
  /** Управляемые значения: id элементов или их содержимое, если id не задан. */
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

type FilterChipsItemBaseProps = Omit<
  ChipsProps,
  | 'id'
  | 'selected'
  | 'onClose'
  | 'closeButtonProps'
  | 'onClick'
  | 'role'
  | 'tabIndex'
  | 'aria-pressed'
  | 'aria-selected'
  | 'aria-disabled'
  | 'children'
>;

export type FilterChipsItemProps = FilterChipsItemBaseProps &
  (
    | {
        /** Значение выбора вместо содержимого; должно быть уникальным в группе. */
        id: string;
        children?: ReactNode;
      }
    | {
        /** Без id значением выбора становится текстовое или числовое содержимое. */
        id?: never;
        children: string | number;
      }
  );
