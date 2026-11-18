import type { ReactNode } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Step } from './Step';
import { Stepper } from './Stepper';

// Проверяем условие интеграции, не повторяя тесты позиционирования и взаимодействий Tooltip.
vi.mock('../Tooltip', () => ({
  TOOLTIP_DELAY: 1500,
  useTooltip: () => ({
    isVisible: true,
    triggerProps: { ref: () => undefined },
    tooltipProps: { id: 'step-overflow-tooltip' },
  }),
  Tooltip: ({ children, id }: { children: ReactNode; id: string }) => (
    <div id={id} role="tooltip">
      {children}
    </div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Step overflow integration', () => {
  it.each([false, true])(
    'uses the required description as the name without a heading (interactive: %s)',
    (interactive) => {
      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(200);
      render(
        <Stepper activeStep={0} onStepChange={interactive ? vi.fn() : undefined}>
          <Step description="Полное пояснение шага" />
        </Stepper>,
      );
      const segment = screen.getByRole(interactive ? 'button' : 'group', { name: 'Полное пояснение шага' });
      const nameElement = document.getElementById(segment.getAttribute('aria-labelledby') ?? '');
      expect(nameElement).toHaveTextContent('Полное пояснение шага');
      expect(segment).not.toHaveAttribute('aria-describedby');
      expect(screen.getByRole('tooltip')).toHaveTextContent(/^Полное пояснение шага$/);
    },
  );

  it('preserves a custom name and associates the description when no heading is provided', () => {
    render(
      <Stepper activeStep={0} onStepChange={vi.fn()}>
        <Step description="Полное пояснение шага" buttonProps={{ 'aria-label': 'Изменить данные' }} />
      </Stepper>,
    );
    expect(screen.getByRole('button', { name: 'Изменить данные' })).toHaveAccessibleDescription(
      'Полное пояснение шага',
    );
  });

  it('measures live text after switching between static and interactive segments', () => {
    let overflowing = false;
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return overflowing && this.isConnected ? 200 : 0;
    });
    const view = (interactive: boolean) => (
      <Stepper activeStep={0} onStepChange={interactive ? vi.fn() : undefined}>
        <Step label="Данные" description="Описание" />
      </Stepper>
    );
    const { rerender } = render(view(false));
    for (const interactive of [true, false]) {
      rerender(view(interactive));
      overflowing = true;
      fireEvent(window, new Event('resize'));
      expect(screen.getByRole('tooltip')).toHaveTextContent('Данные — Описание');
      overflowing = false;
      fireEvent(window, new Event('resize'));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    }
  });

  it('does not render a Tooltip when both text slots fit', () => {
    render(
      <Stepper activeStep={0}>
        <Step label="Данные" description="Описание" />
      </Stepper>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('reveals full text only when a slot overflows, and remeasures on resize', () => {
    let overflowing = true;
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(() => (overflowing ? 200 : 0));
    render(
      <Stepper activeStep={0} onStepChange={vi.fn()}>
        <Step label="Полный заголовок" description="Полное описание" />
      </Stepper>,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Полный заголовок — Полное описание');
    const button = screen.getByRole('button', { name: 'Полный заголовок' });
    expect(button).toHaveAccessibleDescription('Полный заголовок — Полное описание');
    overflowing = false;
    fireEvent(window, new Event('resize'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(button).toHaveAccessibleDescription('Полное описание');
    expect(screen.getByText('Полный заголовок')).toBeInTheDocument();
  });

  it('remeasures multiline description overflow when content or clamp changes', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.textContent === 'Длинное описание' ? 100 : 0;
    });
    const { rerender } = render(
      <Stepper activeStep={0} lineClamp={1}>
        <Step label="Шаг" description="Длинное описание" />
      </Stepper>,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Длинное описание');
    rerender(
      <Stepper activeStep={0} lineClamp={3}>
        <Step label="Шаг" description="Короткое" />
      </Stepper>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
