import type { HTMLAttributes } from 'react';

import type { STEPPER_PROGRESS_COLOR_MODES, STEPPER_PROGRESS_FORMATS } from './constants';

export type StepperProgressColorMode = (typeof STEPPER_PROGRESS_COLOR_MODES)[number];
export type StepperProgressFormat = (typeof STEPPER_PROGRESS_FORMATS)[number];

/** Частичное переопределение русских подписей. Номера шагов начинаются с единицы. */
export interface StepperProgressLocale {
  /** Видимый показатель в формате шагов. */
  progressText?: (current: number, total: number) => string;
  /** Процент от 0 до 100; округление применяется только к тексту. */
  percentageText?: (percentage: number) => string;
  /** Подпись перед названием следующего шага. */
  renderNextStepName?: (name: string) => string;
  /** Доступное описание шага. */
  valueText?: (current: number, total: number) => string;
  /** Резервное название для шага с пустой строкой. */
  stepLabel?: (current: number) => string;
}

/**
 * Пассивный индикатор шагов. ref и HTML-атрибуты относятся к внешнему div.
 * aria-label, aria-labelledby, aria-describedby и aria-valuetext относятся к полосе ProgressPage.
 * Контентом формы и переводом фокуса управляет приложение.
 */
export interface StepperProgressProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow'
> {
  /** Названия шагов в исходном порядке. Пустой массив не отображается. */
  steps: readonly string[];
  /** Индекс текущего шага с нуля. Дробное значение усекается, индекс ограничивается диапазоном.
   * NaN и бесконечность означают первый шаг. Текущий шаг входит в заполнение.
   */
  activeStep: number;
  /** Мобильная компоновка без минимальной ширины 388px. По умолчанию false. */
  mobile?: boolean;
  /** Цвет полосы. По умолчанию 'colored'. */
  colorMode?: StepperProgressColorMode;
  /** Видимый формат показателя. По умолчанию 'steps'. */
  progressFormat?: StepperProgressFormat;
  /** Показывать следующую подпись, если следующий шаг существует. По умолчанию true. */
  displayNextStepName?: boolean;
  /** Форматтеры видимых и доступных подписей. Названия не меняют регистр. */
  progressLocale?: StepperProgressLocale;
}

export interface StyledStepperProgressProps {
  $mobile: boolean;
}

export interface StyledStepperProgressBarProps {
  $colorMode: StepperProgressColorMode;
}
