export const STEPPER_PROGRESS_COLOR_MODES = ['colored', 'neutral'] as const;
export const STEPPER_PROGRESS_FORMATS = ['steps', 'percentage'] as const;
export const STEPPER_PROGRESS_MIN_WIDTH = 388;

const pluralRules = new Intl.PluralRules('ru');
const percentageFormatter = new Intl.NumberFormat('ru', { maximumFractionDigits: 0 });

export const STEPPER_PROGRESS_LOCALE = {
  progressText: (current: number, total: number) =>
    `${current} из ${total} ${pluralRules.select(total) === 'one' ? 'шага' : 'шагов'}`,
  percentageText: (percentage: number) => `${percentageFormatter.format(percentage)}%`,
  renderNextStepName: (name: string) => `Далее — ${name}`,
  valueText: (current: number, total: number) => `Шаг ${current} из ${total}`,
  stepLabel: (current: number) => `Шаг ${current}`,
};
