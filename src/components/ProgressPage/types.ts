import type { HTMLAttributes, ReactNode } from 'react';

import type { PROGRESS_PAGE_APPEARANCES } from './constants';

/** Цветовой вариант ProgressPage. */
export type ProgressPageAppearance = (typeof PROGRESS_PAGE_APPEARANCES)[number];

/** Пользовательские цвета ProgressPage. */
export interface ProgressPageColorConfig {
  /** Цвет фона ProgressPage. */
  backgroundColor?: string;
  /** Цвет индикатора прогресса. */
  progressColor?: string;
  /** Цвет индикатора прогресса в состоянии ошибки. */
  progressColorError?: string;
}

export interface ProgressPageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Текущее значение прогресса от 0 до 100. Значения вне диапазона ограничиваются его границами.
   * Если значение не задано, компонент отображается в состоянии indeterminate.
   */
  value?: number;
  /** Состояние ошибки. */
  error?: boolean;
  /** Видимая подпись, описывающая выполняемую операцию. */
  label?: ReactNode;
  /** Видимая подпись со значением прогресса. */
  valueLabel?: ReactNode;
  /** Цветовой вариант ProgressPage или пользовательские цвета. */
  appearance?: ProgressPageAppearance | ProgressPageColorConfig;
}

export interface StyledProgressPageProps {
  $colorConfig?: ProgressPageColorConfig;
  $error: boolean;
  $indeterminate: boolean;
}
