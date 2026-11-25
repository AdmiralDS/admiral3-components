import { createRef, StrictMode } from 'react';

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { StepperProgress } from './StepperProgress';
import type { StepperProgressLocale } from './types';
import { PROGRESS_PAGE_VALUE_PROPERTY } from '../ProgressPage/constants';

const steps = ['Проверка ФИО', 'Настройка API', 'Подписание договора', 'Обработка заявки', 'Решение', 'Выдача'];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('StepperProgress', () => {
  it('shows the current and next steps without changing their case', () => {
    render(<StepperProgress steps={steps} activeStep={0} />);
    const progress = screen.getByRole('progressbar', { name: 'Проверка ФИО' });
    expect(screen.getByText('1 из 6 шагов')).toBeVisible();
    expect(screen.getByText('Далее — Настройка API')).toBeVisible();
    expect(progress).toHaveAccessibleDescription('Далее — Настройка API');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuetext', 'Шаг 1 из 6');
    expect(Number(progress.getAttribute('aria-valuenow'))).toBeCloseTo(100 / 6, 10);
  });

  it('rounds the visible and accessible percentages while keeping the numeric value precise', () => {
    render(<StepperProgress steps={steps} activeStep={0} progressFormat="percentage" />);
    const progress = screen.getByRole('progressbar');
    expect(screen.getByText('17%')).toBeVisible();
    const value = Number(progress.getAttribute('aria-valuenow'));
    expect(value).toBeCloseTo(100 / 6, 10);
    expect(progress).toHaveAttribute('aria-valuetext', 'Шаг 1 из 6, 17%');
    expect(progress.firstElementChild).toHaveStyle({ [PROGRESS_PAGE_VALUE_PROPERTY]: `${value}%` });
  });

  it('updates all labels and progress from controlled props', () => {
    const { rerender } = render(<StepperProgress steps={steps} activeStep={0} />);
    rerender(<StepperProgress steps={steps} activeStep={2} />);
    const progress = screen.getByRole('progressbar', { name: 'Подписание договора' });
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuetext', 'Шаг 3 из 6');
    expect(screen.getByText('3 из 6 шагов')).toBeVisible();
    expect(screen.getByText('Далее — Обработка заявки')).toBeVisible();
    rerender(<StepperProgress steps={steps} activeStep={0} progressFormat="percentage" />);
    expect(screen.getByText('17%')).toBeVisible();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Шаг 1 из 6, 17%');
    expect(screen.queryByText('3 из 6 шагов')).not.toBeInTheDocument();
  });

  it.each([
    ['negative', -4, 1],
    ['too large', 100, 6],
    ['fractional', 2.9, 3],
    ['NaN', Number.NaN, 1],
    ['positive infinity', Number.POSITIVE_INFINITY, 1],
    ['negative infinity', Number.NEGATIVE_INFINITY, 1],
  ])('normalizes a %s index without an invalid range', (_, index, current) => {
    render(<StepperProgress steps={steps} activeStep={index} />);
    const progress = screen.getByRole('progressbar', { name: steps[current - 1] });
    expect(progress).toHaveAttribute('aria-valuetext', `Шаг ${current} из 6`);
    expect(Number(progress.getAttribute('aria-valuenow'))).toBeCloseTo((current / 6) * 100, 10);
  });

  it('handles empty-to-populated transitions in StrictMode without changing hook order', () => {
    const onError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const ref = createRef<HTMLDivElement>();
    const { container, rerender } = render(
      <StrictMode>
        <StepperProgress ref={ref} steps={[]} activeStep={0} />
      </StrictMode>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(ref.current).toBeNull();
    rerender(
      <StrictMode>
        <StepperProgress ref={ref} steps={steps} activeStep={2} />
      </StrictMode>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    expect(ref.current).not.toBeNull();
    rerender(
      <StrictMode>
        <StepperProgress ref={ref} steps={[]} activeStep={2} />
      </StrictMode>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(ref.current).toBeNull();
    expect(onError).not.toHaveBeenCalled();
  });

  it('clamps the current index when the step collection shrinks', () => {
    const { rerender } = render(<StepperProgress steps={steps} activeStep={4} />);
    rerender(<StepperProgress steps={steps.slice(0, 2)} activeStep={4} />);
    const progress = screen.getByRole('progressbar', { name: 'Настройка API' });
    expect(progress).toHaveAttribute('aria-valuenow', '100');
    expect(progress).toHaveAttribute('aria-valuetext', 'Шаг 2 из 2');
    expect(progress).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByText(/^Далее/)).not.toBeInTheDocument();
  });

  it.each([{ names: steps }, { names: ['Единственный шаг'] }])(
    'omits next-step content at the end: $names',
    ({ names }) => {
      render(<StepperProgress steps={names} activeStep={names.length - 1} progressFormat="percentage" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
      expect(screen.getByText('100%')).toBeVisible();
      expect(screen.queryByText(/^Далее/)).not.toBeInTheDocument();
    },
  );

  it('hides the next step and removes only its description relationship', () => {
    const { rerender } = render(
      <>
        <p id="external-description">Описание процесса</p>
        <StepperProgress steps={steps} activeStep={0} aria-describedby="external-description" />
      </>,
    );
    expect(screen.getByRole('progressbar')).toHaveAccessibleDescription('Описание процесса Далее — Настройка API');
    rerender(
      <>
        <p id="external-description">Описание процесса</p>
        <StepperProgress
          steps={steps}
          activeStep={0}
          aria-describedby="external-description"
          displayNextStepName={false}
        />
      </>,
    );
    expect(screen.queryByText(/^Далее/)).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-describedby', 'external-description');
    expect(screen.getByRole('progressbar')).toHaveAccessibleDescription('Описание процесса');
  });

  it.each([
    [1, 'шага'],
    [2, 'шагов'],
    [5, 'шагов'],
    [11, 'шагов'],
    [21, 'шага'],
    [22, 'шагов'],
    [25, 'шагов'],
  ] as const)('uses the correct Russian form for %s total steps', (total, word) => {
    render(<StepperProgress steps={Array.from({ length: total }, () => 'Шаг')} activeStep={0} />);
    expect(screen.getByText(`1 из ${total} ${word}`)).toBeVisible();
  });

  it('localizes visible labels, accessible values and fallback names independently', () => {
    const locale: StepperProgressLocale = {
      progressText: (current, total) => `Step ${current} of ${total}`,
      percentageText: (percentage) => `${percentage.toFixed(1)} percent`,
      renderNextStepName: (name) => `Next: ${name}`,
      valueText: (current, total) => `Stage ${current} of ${total}`,
      stepLabel: (current) => `Stage ${current}`,
    };
    const { rerender } = render(<StepperProgress steps={[' ', 'API']} activeStep={0} progressLocale={locale} />);
    expect(screen.getByRole('progressbar', { name: 'Stage 1' })).toHaveAttribute('aria-valuetext', 'Stage 1 of 2');
    expect(screen.getByText('Step 1 of 2')).toBeVisible();
    expect(screen.getByText('Next: API')).toBeVisible();
    rerender(<StepperProgress steps={[' ', '']} activeStep={0} progressLocale={locale} progressFormat="percentage" />);
    expect(screen.getByText('50.0 percent')).toBeVisible();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Stage 1 of 2, 50.0 percent');
    expect(screen.getByText('Next: Stage 2')).toBeVisible();
  });

  it('preserves blank entries in the numbering and supplies accessible fallback names', () => {
    render(<StepperProgress steps={['', '  ', 'API']} activeStep={1} />);
    expect(screen.getByRole('progressbar', { name: 'Шаг 2' })).toHaveAttribute('aria-valuetext', 'Шаг 2 из 3');
    expect(screen.getByText('2 из 3 шагов')).toBeVisible();
    expect(screen.getByText('Далее — API')).toBeVisible();
  });

  it('keeps default descriptions when only one formatter is overridden', () => {
    render(
      <StepperProgress
        steps={steps}
        activeStep={0}
        progressLocale={{ progressText: (current, total) => `Этап ${current}/${total}` }}
      />,
    );
    expect(screen.getByText('Этап 1/6')).toBeVisible();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Шаг 1 из 6');
    expect(screen.getByText('Далее — Настройка API')).toBeVisible();
  });

  it('routes accessible overrides to the single progressbar and respects name precedence', () => {
    const { rerender } = render(
      <>
        <span id="custom-name">Оформление кредита</span>
        <StepperProgress
          steps={steps}
          activeStep={2}
          data-testid="root"
          aria-label="Заявка"
          aria-labelledby="custom-name"
          aria-valuetext="Проверка завершена наполовину"
          progressFormat="percentage"
        />
      </>,
    );
    const progress = screen.getByRole('progressbar', { name: 'Оформление кредита' });
    expect(progress).toHaveAttribute('aria-valuetext', 'Проверка завершена наполовину');
    expect(screen.getByTestId('root')).not.toHaveAttribute('aria-label');
    expect(screen.getByTestId('root')).not.toHaveAttribute('aria-labelledby');
    rerender(<StepperProgress steps={steps} activeStep={2} aria-label="Заявка" />);
    expect(screen.getByRole('progressbar', { name: 'Заявка' })).not.toHaveAttribute('aria-labelledby');
  });

  it('keeps labels outside the progressbar and gives each instance independent relationships', () => {
    const { container } = render(
      <>
        <StepperProgress steps={steps} activeStep={0} />
        <StepperProgress steps={steps} activeStep={1} />
      </>,
    );
    const [first, second] = screen.getAllByRole('progressbar');
    expect(first).toHaveAccessibleName('Проверка ФИО');
    expect(second).toHaveAccessibleName('Настройка API');
    expect(first).toHaveAccessibleDescription('Далее — Настройка API');
    expect(second).toHaveAccessibleDescription('Далее — Подписание договора');
    expect(within(first).queryByText('Проверка ФИО')).not.toBeInTheDocument();
    const ids = Array.from(container.querySelectorAll('[id]'), (element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('forwards root attributes and ref, while consuming component props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <StepperProgress
        ref={ref}
        steps={steps}
        activeStep={0}
        mobile
        colorMode="neutral"
        progressFormat="percentage"
        data-testid="root"
        id="progress-root"
        className="custom"
        title="Процесс"
        style={{ marginTop: 12 }}
      />,
    );
    const root = screen.getByTestId('root');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('id', 'progress-root');
    expect(root).toHaveClass('custom');
    expect(root).toHaveAttribute('title', 'Процесс');
    expect(root).toHaveStyle({ marginTop: '12px', minWidth: '0px' });
    expect(root).toHaveAttribute('data-mobile', '');
    expect(root).toHaveAttribute('data-color-mode', 'neutral');
    expect(root).toHaveAttribute('data-progress-format', 'percentage');
    for (const attribute of [
      'steps',
      'activestep',
      'mobile',
      'colormode',
      'progressformat',
      'progresslocale',
      'displaynextstepname',
    ]) {
      expect(root).not.toHaveAttribute(attribute);
    }
  });

  it('uses desktop minimum width without introducing focusable controls or live announcements', () => {
    const { container } = render(<StepperProgress steps={steps} activeStep={0} data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveStyle({ minWidth: '388px' });
    expect(container.querySelector('button, a, input, [tabindex], [aria-live], [role="status"]')).toBeNull();
    expect(screen.getByText('Далее — Настройка API')).not.toHaveAttribute('aria-hidden');
  });
});
