import { createRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { STEPPER_DIMENSIONS, STEPPER_DIMENSION_PARAMETERS } from './constants';
import { Step } from './Step';
import { Stepper } from './Stepper';
import type { StepProps } from './types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const renderSteps = (onStepChange = vi.fn()) => {
  const result = render(
    <Stepper activeStep={2} onStepChange={onStepChange} aria-label="Заказ">
      <Step label="Первый" description="Описание" completed />
      <Step description="???????? ????" label="Заблокированный" completed disabled />
      <Step description="???????? ????" label="Текущий" redo />
      <Step description="???????? ????" label="Завершённый позже" completed />
      <Step description="???????? ????" label="Будущий" />
    </Stepper>,
  );
  return { ...result, onStepChange };
};

describe('Stepper', () => {
  it('allows returning to visited unfinished steps without marking them completed', () => {
    const onStepChange = vi.fn();
    render(
      <Stepper activeStep={0} onStepChange={onStepChange}>
        <Step label="Завершённый" description="Первые данные" completed redo />
        <Step label="Достигнутый" description="Ещё заполняется" visited />
        <Step label="Заблокированный" description="Изменение запрещено" visited disabled />
        <Step label="Будущий" description="Пока недоступен" />
      </Stepper>,
    );
    const current = screen.getByRole('button', { name: 'Завершённый' });
    const visited = screen.getByRole('button', { name: 'Достигнутый' });
    expect(current).toHaveAttribute('data-redo');
    expect(visited).toHaveAttribute('data-state', 'next');
    expect(visited).not.toHaveAccessibleDescription(expect.stringContaining('завершён'));
    act(() => current.focus());
    fireEvent.keyDown(current, { key: 'ArrowRight' });
    expect(visited).toHaveFocus();
    fireEvent.click(visited);
    expect(onStepChange).toHaveBeenCalledWith(1, expect.anything());
    expect(screen.queryByRole('button', { name: 'Заблокированный' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Будущий' })).not.toBeInTheDocument();
  });

  it('renders an empty list without a current step or actions', () => {
    render(<Stepper activeStep={0} onStepChange={vi.fn()} />);
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('preserves explicit native accessible names on action buttons', () => {
    render(
      <Stepper activeStep={0} onStepChange={vi.fn()}>
        <Step description="???????? ????" label="Данные" buttonProps={{ 'aria-label': 'Изменить контактные данные' }} />
      </Stepper>,
    );
    expect(screen.getByRole('button', { name: 'Изменить контактные данные' })).toHaveTextContent('Данные');
  });

  it('preserves the root, ordered list, list items, refs and native attributes', () => {
    const rootRef = createRef<HTMLDivElement>();
    const stepRef = createRef<HTMLLIElement>();
    render(
      <Stepper activeStep={0} ref={rootRef} title="Подсказка" data-testid="stepper" aria-label="Оформление">
        <Step description="???????? ????" ref={stepRef} label="Данные" data-testid="step" lang="ru" value={7} />
      </Stepper>,
    );
    expect(rootRef.current).toBe(screen.getByTestId('stepper'));
    expect(rootRef.current).toHaveAttribute('title', 'Подсказка');
    expect(rootRef.current).toHaveAttribute('data-dimension', 'm');
    expect(rootRef.current).toHaveAttribute('data-color-mode', 'colored');
    expect(screen.getByRole('list').tagName).toBe('OL');
    expect(stepRef.current).toBe(screen.getByRole('listitem'));
    expect(stepRef.current).toHaveAttribute('lang', 'ru');
    expect(stepRef.current).toHaveAttribute('value', '7');
    expect(stepRef.current).toHaveAttribute('aria-current', 'step');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it.each(STEPPER_DIMENSIONS)('uses the %s indicator size without leaking styled props', (dimension) => {
    const { container } = render(
      <Stepper activeStep={0} dimension={dimension}>
        <Step description="???????? ????" label="Шаг" />
      </Stepper>,
    );
    const track = container.querySelector('[aria-hidden="true"]');
    expect(track?.firstElementChild).toHaveStyle({
      width: `${STEPPER_DIMENSION_PARAMETERS[dimension].indicator}px`,
      height: `${STEPPER_DIMENSION_PARAMETERS[dimension].indicator}px`,
    });
    expect(container.querySelector('[dimension], [orientation], [colorMode]')).toBeNull();
  });

  it.each([-1, 2, 0.5, Number.NaN])('does not invent a current step for index %s', (activeStep) => {
    const { container } = render(
      <Stepper activeStep={activeStep}>
        <Step description="???????? ????" label="Один" />
        <Step description="???????? ????" label="Два" />
      </Stepper>,
    );
    expect(container.querySelector('[aria-current]')).toBeNull();
  });

  it('counts only rendered Step children and preserves explicit completion', () => {
    const visible = false;
    const view = (activeStep: number) => (
      <Stepper activeStep={activeStep}>
        {visible && <Step description="???????? ????" label="Скрытый" />}
        {[
          <Step description="???????? ????" key="one" label="Один" />,
          <Step description="???????? ????" key="two" label="Два" completed />,
        ]}
      </Stepper>
    );
    const { container, rerender } = render(view(0));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelectorAll('[data-state="completed"]')).toHaveLength(1);
    rerender(view(1));
    expect(container.querySelector('[data-state="next"]')).toHaveTextContent('Один');
    expect(container.querySelector('[data-state="active"]')).toHaveTextContent('Два');
  });

  it('has one tab stop, skips unavailable steps and moves focus without selecting', () => {
    const { onStepChange } = renderSteps();
    const first = screen.getByRole('button', { name: 'Первый' });
    const current = screen.getByRole('button', { name: 'Текущий' });
    const later = screen.getByRole('button', { name: 'Завершённый позже' });
    expect(current).toHaveAttribute('tabindex', '0');
    expect(current).toHaveAttribute('aria-current', 'step');
    expect(current.closest('li')).not.toHaveAttribute('aria-current');
    expect(first).toHaveAttribute('tabindex', '-1');
    act(() => current.focus());
    fireEvent.keyDown(current, { key: 'ArrowRight' });
    expect(later).toHaveFocus();
    fireEvent.keyDown(later, { key: 'ArrowRight' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowLeft' });
    expect(later).toHaveFocus();
    fireEvent.keyDown(later, { key: 'Home' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'End' });
    expect(later).toHaveFocus();
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it('requests completed steps, leaves current activation inert and preserves native button attributes', () => {
    const onStepChange = vi.fn();
    render(
      <Stepper activeStep={1} onStepChange={onStepChange}>
        <Step
          description="???????? ????"
          label="Первый"
          completed
          buttonProps={{ name: 'previous', 'aria-controls': 'content' }}
        />
        <Step description="???????? ????" label="Текущий" />
      </Stepper>,
    );
    const first = screen.getByRole('button', { name: 'Первый' });
    expect(first).toHaveAttribute('type', 'button');
    expect(first).toHaveAttribute('name', 'previous');
    expect(first).toHaveAttribute('aria-controls', 'content');
    fireEvent.click(first);
    expect(onStepChange).toHaveBeenCalledWith(0, expect.objectContaining({ type: 'click' }));
    fireEvent.click(screen.getByRole('button', { name: 'Текущий' }));
    expect(onStepChange).toHaveBeenCalledTimes(1);
  });

  it.each(['capture', 'button'] as const)('allows the %s click handler to cancel navigation', (handler) => {
    const onStepChange = vi.fn();
    const cancel: NonNullable<StepProps['onClick']> = (event) => event.preventDefault();
    render(
      <Stepper activeStep={1} onStepChange={onStepChange}>
        <Step
          description="???????? ????"
          label="Назад"
          completed
          onClickCapture={handler === 'capture' ? cancel : undefined}
          buttonProps={handler === 'button' ? { onClick: (event) => event.preventDefault() } : undefined}
        />
        <Step description="???????? ????" label="Текущий" />
      </Stepper>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Назад' }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it.each(['bubble', 'stop', 'cancel'] as const)('composes the button action with native %s behavior', (mode) => {
    const calls: string[] = [];
    const onStepChange = vi.fn((_index, event) => {
      expect(event.currentTarget).toBe(screen.getByRole('button', { name: 'Previous' }));
      calls.push('change');
    });
    render(
      <Stepper activeStep={1} onStepChange={onStepChange} onClick={() => calls.push('outer')}>
        <Step
          label="Previous"
          description="Completed step"
          completed
          onClick={(event) => {
            expect(event.currentTarget.tagName).toBe('LI');
            calls.push('item');
          }}
          buttonProps={{
            onClick: (event) => {
              calls.push('button');
              if (mode === 'stop') event.stopPropagation();
              if (mode === 'cancel') event.preventDefault();
            },
          }}
        />
        <Step label="Current" description="Current step" />
      </Stepper>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(calls).toEqual(
      mode === 'stop'
        ? ['button', 'change']
        : mode === 'cancel'
          ? ['button', 'item', 'outer']
          : ['button', 'change', 'item', 'outer'],
    );
  });

  it('does not invoke disabled handlers or turn future steps into buttons', () => {
    const onClick = vi.fn();
    const onStepChange = vi.fn();
    render(
      <Stepper activeStep={-1} onStepChange={onStepChange}>
        <Step description="???????? ????" label="Недоступно" completed disabled onClick={onClick} />
        <Step description="???????? ????" label="Будущий" />
      </Stepper>,
    );
    fireEvent.click(screen.getByText('Недоступно'));
    expect(onClick).not.toHaveBeenCalled();
    expect(onStepChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses orientation-specific arrows and honors cancelled key events', () => {
    const { rerender } = render(
      <Stepper activeStep={0} orientation="vertical" onStepChange={vi.fn()}>
        <Step description="???????? ????" label="Один" />
        <Step description="???????? ????" label="Два" completed />
      </Stepper>,
    );
    const first = screen.getByRole('button', { name: 'Один' });
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: 'Два' })).toHaveFocus();
    rerender(
      <Stepper activeStep={0} onStepChange={vi.fn()} onKeyDown={(event) => event.preventDefault()}>
        <Step description="???????? ????" label="Один" />
        <Step description="???????? ????" label="Два" completed />
      </Stepper>,
    );
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'End' });
    expect(first).toHaveFocus();
  });

  it('falls back to the first completed step when the current step is disabled', () => {
    render(
      <Stepper activeStep={1} onStepChange={vi.fn()}>
        <Step description="???????? ????" label="Первый" completed />
        <Step description="???????? ????" label="Текущий" disabled />
      </Stepper>,
    );
    expect(screen.getByRole('button', { name: 'Первый' })).toHaveAttribute('tabindex', '0');
  });

  it('recovers focus after removing the focused step without taking focus from outside', () => {
    const view = (removed: boolean) => (
      <>
        <button>Вне группы</button>
        <Stepper activeStep={0} onStepChange={vi.fn()}>
          <Step description="???????? ????" key="one" label="Один" />
          {!removed && <Step description="???????? ????" key="two" label="Два" completed />}
        </Stepper>
      </>
    );
    const { rerender } = render(view(false));
    act(() => screen.getByRole('button', { name: 'Два' }).focus());
    rerender(view(true));
    expect(screen.getByRole('button', { name: 'Один' })).toHaveFocus();
    act(() => screen.getByRole('button', { name: 'Вне группы' }).focus());
    rerender(view(false));
    expect(screen.getByRole('button', { name: 'Вне группы' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Один' })).toHaveAttribute('tabindex', '0');
  });

  it('preserves keyed focus during reorder and recovers after disabling it', () => {
    const view = (reverse: boolean, disabled: boolean) => (
      <Stepper activeStep={reverse ? 1 : 0} onStepChange={vi.fn()}>
        {(reverse ? ['two', 'one'] : ['one', 'two']).map((key) => (
          <Step description="???????? ????" key={key} label={key} completed disabled={key === 'two' && disabled} />
        ))}
      </Stepper>
    );
    const { rerender } = render(view(false, false));
    const second = screen.getByRole('button', { name: 'two' });
    act(() => second.focus());
    rerender(view(true, false));
    expect(second).toHaveFocus();
    rerender(view(true, true));
    expect(screen.getByRole('button', { name: 'one' })).toHaveFocus();
  });

  it('returns focus to the group when interaction is removed', () => {
    const { rerender } = render(
      <Stepper activeStep={0} onStepChange={vi.fn()}>
        <Step description="???????? ????" label="Один" />
      </Stepper>,
    );
    act(() => screen.getByRole('button', { name: 'Один' }).focus());
    rerender(
      <Stepper activeStep={0}>
        <Step description="???????? ????" label="Один" />
      </Stepper>,
    );
    expect(screen.getByRole('group', { name: 'Этапы выполнения' })).toHaveFocus();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not recover focus after an intentional blur with no related target', () => {
    const view = (dimension: 'm' | 's') => (
      <Stepper activeStep={0} dimension={dimension} onStepChange={vi.fn()}>
        <Step description="???????? ????" label="Один" />
        <Step description="???????? ????" label="Два" completed />
      </Stepper>
    );
    const { rerender } = render(view('m'));
    act(() => screen.getByRole('button', { name: 'Два' }).focus());
    act(() => screen.getByRole('button', { name: 'Два' }).blur());
    rerender(view('s'));
    expect(document.body).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Один' })).toHaveAttribute('tabindex', '0');
  });

  it('skips hidden actions for entry and arrows and recovers focus when an action is hidden', () => {
    const view = (hideSecond: boolean) => (
      <Stepper activeStep={0} onStepChange={vi.fn()}>
        <Step description="???????? ????" label="Скрытый текущий" buttonProps={{ hidden: true }} />
        <Step description="???????? ????" label="Два" completed hidden={hideSecond} />
        <Step description="???????? ????" label="Три" completed />
        <Step description="???????? ????" label="Невидимый" completed buttonProps={{ style: { display: 'none' } }} />
      </Stepper>
    );
    const { rerender } = render(view(false));
    const second = screen.getByRole('button', { name: 'Два' });
    const third = screen.getByRole('button', { name: 'Три' });
    expect(second).toHaveAttribute('tabindex', '0');
    act(() => second.focus());
    fireEvent.keyDown(second, { key: 'ArrowLeft' });
    expect(third).toHaveFocus();
    act(() => second.focus());
    rerender(view(true));
    expect(third).toHaveFocus();
    expect(third).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
  });

  it('associates descriptions and localized states without discarding consumer descriptions', () => {
    render(
      <>
        <p id="help">Внешняя подсказка</p>
        <Stepper
          activeStep={0}
          onStepChange={vi.fn()}
          statusLabels={{ error: 'Invalid', completed: 'Done', redo: 'Editing' }}
        >
          <Step
            label="Данные"
            description="Описание шага"
            completed
            status="error"
            redo
            buttonProps={{ 'aria-describedby': 'help' }}
          />
        </Stepper>
      </>,
    );
    const button = screen.getByRole('button', { name: 'Данные' });
    expect(button).toHaveAccessibleDescription('Внешняя подсказка Описание шага Invalid. Done. Editing');
    expect(screen.getByRole('group', { name: 'Этапы выполнения' })).toHaveAccessibleDescription(
      expect.stringContaining('стрелки влево'),
    );
  });

  it('applies state precedence, redo and the final connector option', () => {
    const { container, rerender } = render(
      <Stepper activeStep={0}>
        <Step description="???????? ????" label="Ошибка" status="error" completed redo />
        <Step description="???????? ????" label="Недоступно" disabled status="warning" completed />
      </Stepper>,
    );
    expect(container.querySelector('[data-state="error"]')).toHaveAttribute('data-redo');
    expect(container.querySelector('[data-state="disabled"]')).not.toHaveAttribute('data-redo');
    expect(container.querySelector('[data-hide-line]')).toHaveTextContent('Недоступно');
    rerender(
      <Stepper activeStep={0} showLastStepLine>
        <Step description="???????? ????" label="Один" redo />
      </Stepper>,
    );
    expect(container.querySelector('[data-hide-line]')).toBeNull();
  });

  it('forces horizontal mobile mode and exposes no inactive boolean markers', () => {
    const { rerender } = render(
      <Stepper activeStep={0} mobile orientation="vertical" data-testid="root">
        <Step description="???????? ????" label="Один" />
      </Stepper>,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getByTestId('root')).toHaveAttribute('data-mobile', '');
    rerender(
      <Stepper activeStep={0} data-testid="root">
        <Step description="???????? ????" label="Один" />
      </Stepper>,
    );
    expect(screen.getByTestId('root')).not.toHaveAttribute('data-mobile');
  });
});
