import { createContext } from 'react';
import type { RefObject, SyntheticEvent } from 'react';

import type { ChipDimension } from '../types';

export interface FilterChipsContextValue {
  /** Размер элемента по умолчанию, если у Item не задан собственный dimension. */
  dimension: ChipDimension;
  /** Отключена ли вся группа; Item объединяет это значение со своим disabled. */
  disabled: boolean;
  /** Значение единственного Item с tabIndex=0; null, если доступных элементов нет. */
  focusableItemValue: string | null;
  /** Проверяет, входит ли значение Item в текущий выбор группы. */
  isSelected: (value: string) => boolean;
  /** Переключает выбор активного Item: без value обновляет состояние группы, при наличии onChange уведомляет о результате. */
  select: (value: string, event: SyntheticEvent<HTMLDivElement>) => void;
  /** Регистрирует фокусируемый узел Item для навигации. */
  registerItem: (value: string, ref: RefObject<HTMLDivElement | null>, disabled: boolean) => () => void;
  /** Обновляет доступность зарегистрированного Item. */
  updateItem: (value: string, disabled: boolean) => void;
}

export const FilterChipsContext = createContext<FilterChipsContextValue | null>(null);
