import type { ButtonHTMLAttributes, HTMLAttributes, LiHTMLAttributes, MouseEvent, ReactElement } from 'react';

import type {
  STEPPER_COLOR_MODES,
  STEPPER_DIMENSIONS,
  STEPPER_LINE_CLAMPS,
  STEPPER_ORIENTATIONS,
  STEP_STATUSES,
} from './constants';

export type StepperDimension = (typeof STEPPER_DIMENSIONS)[number];
export type StepperOrientation = (typeof STEPPER_ORIENTATIONS)[number];
export type StepperColorMode = (typeof STEPPER_COLOR_MODES)[number];
export type StepperLineClamp = (typeof STEPPER_LINE_CLAMPS)[number];
export type StepStatus = (typeof STEP_STATUSES)[number];

type StepperChild = ReactElement<StepProps> | boolean | null | undefined | StepperChild[];

/** Локализация состояний и подсказки клавиатурной навигации. */
export interface StepperStatusLabels {
  completed: string;
  error: string;
  warning: string;
  disabled: string;
  redo: string;
  horizontalNavigation: string;
  verticalNavigation: string;
}

/** Stepper отображает шаги; содержимым формы и его фокусом управляет потребитель. */
export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Прямые дочерние Step, в том числе массивы и условные элементы. */
  children?: StepperChild;
  /** Индекс текущего шага с нуля. -1 или индекс вне диапазона означает отсутствие текущего шага. */
  activeStep: number;
  /** Размер компонента. По умолчанию 'm'. */
  dimension?: StepperDimension;
  /** Ориентация. По умолчанию 'horizontal'. */
  orientation?: StepperOrientation;
  /** Цветовой режим. По умолчанию 'colored'. Семантические цвета ошибок сохраняются. */
  colorMode?: StepperColorMode;
  /** Горизонтальная прокрутка с фиксированной шириной шагов независимо от orientation. */
  mobile?: boolean;
  /** Ширина шага в пикселях. На desktop по умолчанию адаптивная, в mobile — 133px. */
  stepWidth?: number;
  /** Максимальное число строк описания. По умолчанию 2. Заголовок всегда однострочный. */
  lineClamp?: StepperLineClamp;
  /** Показывать соединительную линию последнего шага. По умолчанию false. */
  showLastStepLine?: boolean;
  /** Включает выбор завершённых и посещённых шагов. activeStep не меняет; currentTarget события — кнопка шага. */
  onStepChange?: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
  /** Частичное переопределение русских подписей состояний и клавиатурной подсказки. */
  statusLabels?: Partial<StepperStatusLabels>;
}

/** Нативные атрибуты и ref относятся к li; buttonProps — к кнопке внутри шага. */
export interface StepProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  /** Необязательный заголовок. Без него доступное имя берётся из description. */
  label?: string;
  /** Обязательное пояснение шага. */
  description: string;
  /** Завершение задаётся явно и не зависит от индекса текущего шага. */
  completed?: boolean;
  /** Шаг уже достигнут и доступен для возврата, даже если ещё не завершён. */
  visited?: boolean;
  disabled?: boolean;
  /** Пунктирная линия текущего повторно редактируемого шага. */
  redo?: boolean;
  status?: StepStatus;
  /** Нативные свойства кнопки. onClick вызывается до выбора; preventDefault отменяет выбор, stopPropagation — только всплытие. */
  buttonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'dangerouslySetInnerHTML' | 'disabled' | 'tabIndex' | 'type'
  >;
}

export interface StyledStepperProps {
  $orientation: StepperOrientation;
  $mobile: boolean;
}

export interface StyledStepProps {
  $dimension: StepperDimension;
  $orientation: StepperOrientation;
  $colorMode: StepperColorMode;
}

export type StepVisualState = 'disabled' | 'error' | 'warning' | 'active' | 'completed' | 'next';
