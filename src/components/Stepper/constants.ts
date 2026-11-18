import type { StepperStatusLabels } from './types';

export const STEPPER_DIMENSIONS = ['m', 's'] as const;
export const STEPPER_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export const STEPPER_COLOR_MODES = ['colored', 'neutral'] as const;
export const STEPPER_LINE_CLAMPS = [1, 2, 3] as const;
export const STEP_STATUSES = ['default', 'error', 'warning'] as const;

export const STEPPER_DIMENSION_PARAMETERS = {
  m: { indicator: 24, gap: 10, trackGap: 10, verticalGap: 12 },
  s: { indicator: 20, gap: 8, trackGap: 8, verticalGap: 10 },
} as const;

export const STEPPER_MOBILE_STEP_WIDTH = 133;
export const STEPPER_MOBILE_PADDING = 16;
export const STEPPER_CONNECTOR_WIDTH = 2;
// В Firefox метрики VTB Group UI могут добавлять 1px к scrollHeight без скрытых строк.
export const STEPPER_DESCRIPTION_OVERFLOW_TOLERANCE = 1;
export const STEPPER_REDO_DASH_LENGTH = 8;
export const STEPPER_REDO_DASH_GAP = 4;

export const STEPPER_STATUS_LABELS: StepperStatusLabels = {
  completed: 'Шаг завершён',
  error: 'Ошибка',
  warning: 'Предупреждение',
  disabled: 'Шаг недоступен',
  redo: 'Повторное редактирование',
  horizontalNavigation:
    'Для перемещения между доступными шагами используйте стрелки влево и вправо, Home и End. Для выбора нажмите Enter или пробел.',
  verticalNavigation:
    'Для перемещения между доступными шагами используйте стрелки вверх и вниз, Home и End. Для выбора нажмите Enter или пробел.',
};
