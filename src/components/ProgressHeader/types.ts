import type { HTMLAttributes } from 'react';

export interface ProgressHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Текущее значение прогресса от 0 до 100. Значения вне диапазона ограничиваются его границами.
   * Если value не задан, компонент отображается в неопределённом состоянии.
   */
  value?: number;
  /** Состояние ошибки. */
  error?: boolean;
}
