import { createContext } from 'react';
import type { SyntheticEvent } from 'react';

import type { ChipDimension } from '../types';

export interface FilterChipsContextValue {
  /** Размер элемента по умолчанию, если у Item не задан собственный dimension. */
  dimension: ChipDimension;
  /** Отключена ли вся группа; Item объединяет это значение со своим disabled. */
  disabled: boolean;
  /** Значение единственного Item с tabIndex=0; null, если доступных элементов нет. */
  tabbableValue: string | null;
  /** Проверяет, входит ли значение Item в текущий выбор группы. */
  isSelected: (value: string) => boolean;
  /** Переключает выбор активного Item: без value обновляет состояние группы, при наличии onChange уведомляет о результате. */
  select: (value: string, event: SyntheticEvent<HTMLDivElement>) => void;
  /** Регистрирует фокусируемый узел Item для навигации; null удаляет его из реестра. */
  registerItem: (value: string, node: HTMLDivElement | null) => void;
}

export const FilterChipsContext = createContext<FilterChipsContextValue | null>(null);
