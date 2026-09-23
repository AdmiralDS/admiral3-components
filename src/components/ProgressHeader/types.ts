import type { HTMLAttributes } from 'react';

import type { PROGRESS_HEADER_APPEARANCES } from './constants';

/** Цветовой вариант ProgressHeader. */
export type ProgressHeaderAppearance = (typeof PROGRESS_HEADER_APPEARANCES)[number];

/** Пользовательские цвета ProgressHeader. */
export interface ProgressHeaderColorConfig {
  /** Цвет фона ProgressHeader. */
  backgroundColor?: string;
  /** Цвет индикатора прогресса. */
  progressColor?: string;
  /** Цвет индикатора прогресса в состоянии ошибки. */
  progressColorError?: string;
}

export interface ProgressHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Текущее значение прогресса от 0 до 100. Значения вне диапазона ограничиваются его границами.
   * Если value не задан, компонент отображается в состоянии indeterminate.
   */
  value?: number;
  /** Состояние ошибки. */
  error?: boolean;
  /** Цветовой вариант ProgressHeader или пользовательские цвета. */
  appearance?: ProgressHeaderAppearance | ProgressHeaderColorConfig;
}

export interface StyledProgressHeaderProps {
  $colorConfig?: ProgressHeaderColorConfig;
  $error: boolean;
  $indeterminate: boolean;
}
