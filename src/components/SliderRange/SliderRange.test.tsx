import { createRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SliderRange } from './SliderRange';
import { SliderTextRow, SliderValue } from '../_internal/SliderAtoms';

describe('SliderRange', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });
  it('does not grow the stylesheet when changing either bound in a large range', () => {
    const { rerender } = render(<SliderRange max={1_000_000} value={[250_000, 750_000]} />);
    // Оба конечных варианта z-index создаются при выборе активного Handle, независимо от его значения.
    fireEvent.focus(screen.getAllByRole('slider')[0]);
    fireEvent.focus(screen.getAllByRole('slider')[1]);
    const countRules = () =>
      Array.from(document.styleSheets).reduce((count, sheet) => count + sheet.cssRules.length, 0);
    const initialRuleCount = countRules();
    const ranges: [number, number][] = [
      [0, 1_000_000],
      [1, 999_999],
      [12_345, 678_901],
      [500_000, 500_000],
      [1_000_000, 1_000_000],
    ];

    for (const value of ranges) {
      rerender(<SliderRange max={1_000_000} value={value} />);
      const inputs = screen.getAllByRole('slider');
      expect(inputs[0]).toHaveValue(String(value[0]));
      expect(inputs[1]).toHaveValue(String(value[1]));
      expect(countRules()).toBe(initialRuleCount);
    }
  });
  it('names both bounds explicitly with a JSX label and forwards refs to native inputs', () => {
    const ref = createRef<HTMLDivElement>();
    const lowerRef = createRef<HTMLInputElement>();
    const upperRef = createRef<HTMLInputElement>();
    render(
      <SliderRange
        label={<strong>Сумма</strong>}
        ref={ref}
        lowerNativeSliderRef={lowerRef}
        upperNativeSliderRef={upperRef}
        lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
        upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
        defaultValue={[25, 75]}
        data-testid="root"
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(lowerRef.current).toBe(screen.getByRole('slider', { name: 'Минимальная сумма' }));
    expect(upperRef.current).toBe(screen.getByRole('slider', { name: 'Максимальная сумма' }));
    expect(upperRef.current).toHaveValue('75');
  });
  it.each([
    { bound: 0, key: 'ArrowRight', first: 26, second: 27 },
    { bound: 1, key: 'ArrowLeft', first: 74, second: 73 },
  ])(
    'keeps the keyboard Tooltip for two seconds after the last change of bound $bound',
    ({ bound, key, first, second }) => {
      vi.useFakeTimers();
      render(<SliderRange defaultValue={[25, 75]} showTooltip renderValue={(value) => `${value} ₽`} />);
      const input = screen.getAllByRole('slider')[bound];
      act(() => input.focus());
      fireEvent.keyDown(input, { key });
      fireEvent.change(input, { target: { value: String(first) } });
      fireEvent.keyUp(input, { key });
      expect(screen.getByRole('tooltip')).toHaveTextContent(`${first} ₽`);
      act(() => vi.advanceTimersByTime(1500));
      expect(screen.getByRole('tooltip')).toHaveTextContent(`${first} ₽`);
      fireEvent.keyDown(input, { key });
      fireEvent.change(input, { target: { value: String(second) } });
      fireEvent.keyUp(input, { key });
      expect(screen.getByRole('tooltip')).toHaveTextContent(`${second} ₽`);
      // Первый таймер уже истёк, но повторное изменение должно было его перезапустить.
      act(() => vi.advanceTimersByTime(500));
      expect(screen.getByRole('tooltip')).toHaveTextContent(`${second} ₽`);
      act(() => vi.advanceTimersByTime(1499));
      expect(screen.getByRole('tooltip')).toHaveTextContent(`${second} ₽`);
      act(() => vi.advanceTimersByTime(1));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(input).toHaveFocus();
    },
  );
  it('lets user attributes override defaults on the container and both native sliders', () => {
    render(
      <SliderRange
        disabled
        defaultValue={[25, 75]}
        aria-disabled={false}
        data-testid="root"
        lowerNativeSliderProps={{ tabIndex: 0, 'aria-valuemax': 90 }}
        upperNativeSliderProps={{ tabIndex: 0, 'aria-valuemin': 10 }}
      />,
    );
    const [lower, upper] = screen.getAllByRole('slider');
    expect(screen.getByTestId('root')).toHaveAttribute('aria-disabled', 'false');
    expect(lower).toHaveAttribute('aria-valuemax', '90');
    expect(upper).toHaveAttribute('aria-valuemin', '10');
    for (const input of [lower, upper]) {
      expect(input).toHaveAttribute('tabindex', '0');
      expect(input).toBeDisabled();
    }
  });
  it('calls custom focus handlers and preserves focus on both coincident bounds', () => {
    const focused: EventTarget[] = [];
    render(
      <SliderRange
        defaultValue={[50, 50]}
        lowerNativeSliderProps={{ onFocus: (event) => focused.push(event.currentTarget) }}
        upperNativeSliderProps={{ onFocus: (event) => focused.push(event.currentTarget) }}
      />,
    );
    const [lower, upper] = screen.getAllByRole('slider');
    act(() => lower.focus());
    expect(lower).toHaveFocus();
    act(() => upper.focus());
    expect(upper).toHaveFocus();
    expect(focused).toEqual([lower, upper]);
  });
  it('updates uncontrolled values and never crosses the other bound', () => {
    const onChange = vi.fn();
    render(<SliderRange label="Сумма" defaultValue={[25, 75]} onChange={onChange} />);
    fireEvent.change(screen.getAllByRole('slider')[0], { target: { value: '90' } });
    expect(onChange).toHaveBeenLastCalledWith([75, 75]);
    expect(screen.getByText('75 — 75')).toBeVisible();
  });
  it('keeps controlled values until their owner changes them', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SliderRange value={[25, 75]} onChange={onChange} />);
    const [lower, upper] = screen.getAllByRole('slider');
    expect(lower).toHaveAttribute('max', '100');
    expect(upper).toHaveAttribute('min', '0');
    expect(lower).toHaveAttribute('aria-valuemax', '75');
    expect(upper).toHaveAttribute('aria-valuemin', '25');
    fireEvent.change(lower, { target: { value: '90' } });
    expect(onChange).toHaveBeenLastCalledWith([75, 75]);
    fireEvent.change(upper, { target: { value: '10' } });
    expect(onChange).toHaveBeenLastCalledWith([25, 25]);
    expect(lower).toHaveValue('25');
    expect(upper).toHaveValue('75');
    fireEvent.change(upper, { target: { value: '90' } });
    expect(onChange).toHaveBeenLastCalledWith([25, 90]);
    expect(screen.getAllByRole('slider')[1]).toHaveValue('75');
    rerender(<SliderRange value={[25, 90]} onChange={onChange} />);
    expect(screen.getAllByRole('slider')[1]).toHaveValue('90');
  });
  it('keeps native bounds and the displayed interval consistent after normalizing incoming props', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SliderRange label="Сумма" step={10} value={[24, 77]} onChange={onChange} />);
    const [lower, upper] = screen.getAllByRole('slider');
    expect(lower).toHaveValue('20');
    expect(upper).toHaveValue('80');
    expect(screen.getByText('20 — 80')).toBeVisible();
    expect(lower).toHaveAttribute('step', '10');
    expect(upper).toHaveAttribute('step', '10');
    fireEvent.change(lower, { target: { value: '34' } });
    expect(onChange).toHaveBeenLastCalledWith([30, 80]);
    fireEvent.change(upper, { target: { value: '67' } });
    expect(onChange).toHaveBeenLastCalledWith([20, 70]);
    onChange.mockClear();

    rerender(<SliderRange label="Сумма" step={10} value={[80, 20]} onChange={onChange} />);
    expect(lower).toHaveValue('80');
    expect(upper).toHaveValue('80');
    expect(screen.getByText('80 — 80')).toBeVisible();

    rerender(<SliderRange label="Сумма" min={10} max={5} step={0} value={[5, 20]} onChange={onChange} />);
    for (const input of [lower, upper]) {
      expect(input).toHaveAttribute('min', '10');
      expect(input).toHaveAttribute('max', '10');
      expect(input).toHaveAttribute('step', '1');
      expect(input).toHaveValue('10');
    }
    expect(screen.getByText('10 — 10')).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();
  });
  it('renormalizes edited uncontrolled bounds when min, max and step change without emitting onChange', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SliderRange label="Интервал" defaultValue={[25, 75]} onChange={onChange} />);
    const [lower, upper] = screen.getAllByRole('slider');
    fireEvent.change(lower, { target: { value: '34' } });
    fireEvent.change(upper, { target: { value: '94' } });
    onChange.mockClear();
    rerender(<SliderRange label="Интервал" min={10} max={80} step={10} onChange={onChange} />);
    expect(lower).toHaveValue('30');
    expect(upper).toHaveValue('80');
    expect(screen.getByText('30 — 80')).toBeVisible();
    rerender(<SliderRange label="Интервал" min={20} max={100} step={20} onChange={onChange} />);
    expect(lower).toHaveValue('40');
    expect(upper).toHaveValue('100');
    expect(screen.getByText('40 — 100')).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();
  });
  it('normalizes fractional steps when max is off-step', () => {
    render(<SliderRange label="Интервал" min={0.1} max={1} step={0.2} value={[0.2, 1]} />);
    const [lower, upper] = screen.getAllByRole('slider');
    expect(lower).toHaveValue('0.3');
    expect(upper).toHaveValue('0.9');
    expect(screen.getByText('0.3 — 0.9')).toBeVisible();
  });
  it('normalizes nonfinite bounds, values and step without emitting onChange', () => {
    const onChange = vi.fn();
    render(<SliderRange min={NaN} max={Infinity} step={NaN} value={[NaN, Infinity]} onChange={onChange} />);
    for (const input of screen.getAllByRole('slider')) {
      expect(input).toHaveValue('0');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '0');
      expect(input).toHaveAttribute('step', '1');
    }
    expect(onChange).not.toHaveBeenCalled();
  });
  it('restores both native values and the displayed interval after reset', () => {
    vi.useFakeTimers();
    render(
      <>
        <form id="interval" data-testid="form" />
        <form id="other-form" />
        <SliderRange
          label="Сумма"
          defaultValue={[25, 75]}
          lowerNativeSliderProps={{ name: 'from', form: 'interval' }}
          upperNativeSliderProps={{ name: 'to', form: 'other-form' }}
        />
      </>,
    );
    const [lower, upper] = screen.getAllByRole('slider');
    fireEvent.change(lower, { target: { value: '40' } });
    fireEvent.change(upper, { target: { value: '90' } });
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect((lower as HTMLInputElement).form).toBe(form);
    expect((upper as HTMLInputElement).form).toBe(form);
    expect(new FormData(form).get('from')).toBe('40');
    expect(new FormData(form).get('to')).toBe('90');
    expect(screen.getByText('40 — 90')).toBeVisible();
    act(() => form.reset());
    act(() => vi.runOnlyPendingTimers());
    expect(lower).toHaveValue('25');
    expect(upper).toHaveValue('75');
    expect(screen.getByText('25 — 75')).toBeVisible();
  });
  it('preserves both native values and the displayed interval after cancelled reset', () => {
    vi.useFakeTimers();
    render(
      <form data-testid="form" onReset={(event) => event.preventDefault()}>
        <SliderRange label="Сумма" defaultValue={[25, 75]} />
      </form>,
    );
    const [lower, upper] = screen.getAllByRole('slider');
    fireEvent.change(lower, { target: { value: '40' } });
    fireEvent.change(upper, { target: { value: '90' } });
    act(() => (screen.getByTestId('form') as HTMLFormElement).reset());
    expect(lower).toHaveValue('40');
    expect(upper).toHaveValue('90');
    expect(screen.getByText('40 — 90')).toBeVisible();
    act(() => vi.runOnlyPendingTimers());
    expect(lower).toHaveValue('40');
    expect(upper).toHaveValue('90');
    expect(screen.getByText('40 — 90')).toBeVisible();
  });
  it('disables both bounds and excludes them from tab order', () => {
    const onChange = vi.fn();
    render(<SliderRange disabled defaultValue={[25, 75]} onChange={onChange} />);
    for (const input of screen.getAllByRole('slider')) {
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('tabindex', '-1');
      fireEvent.change(input, { target: { value: '50' } });
    }
    expect(onChange).not.toHaveBeenCalled();
  });
  it('preserves native pointer handling for both inputs rendered into an iframe', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const onChange = vi.fn();
    const { container, unmount } = render(<SliderRange defaultValue={[25, 75]} onChange={onChange} />, {
      container: iframe.contentDocument!.body,
    });
    try {
      const inputs = container.querySelectorAll('input');
      expect(inputs).toHaveLength(2);
      for (const input of inputs) {
        expect(input).not.toBeInstanceOf(HTMLInputElement);
        const event = new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 });
        Object.defineProperty(event, 'isPrimary', { value: true });
        fireEvent(input, event);
        expect(event.defaultPrevented).toBe(false);
      }
      expect(onChange).not.toHaveBeenCalled();
    } finally {
      unmount();
      iframe.remove();
    }
  });
  it('keeps both bounds focusable when min and max coincide without disabling them', () => {
    const onChange = vi.fn();
    render(<SliderRange min={20} max={20} onChange={onChange} data-testid="root" />);
    const inputs = screen.getAllByRole('slider');
    expect(inputs).toHaveLength(2);
    expect(screen.getByTestId('root')).not.toHaveAttribute('data-disabled');
    expect(screen.getByTestId('root')).not.toHaveAttribute('aria-disabled');
    for (const input of inputs) {
      expect(input).toBeEnabled();
      expect(input).toHaveAttribute('tabindex', '0');
      act(() => input.focus());
      expect(input).toHaveFocus();
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.change(input, { target: { value: '20' } });
      expect(input).toHaveValue('20');
      expect(input.parentElement).not.toHaveAttribute('data-disabled');
    }
    expect(screen.getAllByRole('button')).toHaveLength(1);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeEnabled();
      fireEvent.click(button);
    }
    expect(onChange).not.toHaveBeenCalled();
  });
  it('preserves custom per-bound accessible names and descriptions', () => {
    render(
      <>
        <p id="help">Описание</p>
        <span id="upper-name">Максимальная сумма</span>
        <SliderRange
          label="Сумма"
          lowerNativeSliderProps={{ 'aria-label': 'От', 'aria-describedby': 'help' }}
          upperNativeSliderProps={{ 'aria-labelledby': 'upper-name' }}
        />
      </>,
    );
    expect(screen.getByRole('slider', { name: 'От' })).toHaveAccessibleDescription('Описание');
    expect(screen.getByRole('slider', { name: 'Максимальная сумма' })).toHaveValue('100');
  });
  it('renders only endpoint labels and focuses the selected bound', () => {
    const onChange = vi.fn();
    const renderMarks = vi.fn((value: number) => <span>{value}</span>);
    render(<SliderRange defaultValue={[25, 75]} renderMarks={renderMarks} onChange={onChange} />);
    const [lower, upper] = screen.getAllByRole('slider');
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(renderMarks.mock.calls.map(([value]) => value)).toEqual([0, 100]);
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(lower).toHaveValue('0');
    expect(lower).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(upper).toHaveValue('100');
    expect(upper).toHaveFocus();
    onChange.mockClear();
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(onChange).not.toHaveBeenCalled();
  });
  it('renders JSX for both bound values and their Tooltip without serializing elements into aria', () => {
    render(
      <SliderRange
        label="Сумма"
        defaultValue={[25, 75]}
        showTooltip
        renderValue={(value) => <strong>{value} ₽</strong>}
        lowerNativeSliderProps={{ 'aria-valuetext': 'Нижняя сумма' }}
      />,
    );
    const [lower, upper] = screen.getAllByRole('slider');
    expect(screen.getByText('25 ₽').tagName).toBe('STRONG');
    expect(screen.getByText('75 ₽').tagName).toBe('STRONG');
    expect(lower).toHaveAttribute('aria-valuetext', 'Нижняя сумма');
    expect(upper).not.toHaveAttribute('aria-valuetext');
    act(() => upper.focus());
    fireEvent.keyDown(upper, { key: 'ArrowLeft' });
    fireEvent.change(upper, { target: { value: '74' } });
    expect(screen.getByRole('tooltip').querySelector('strong')).toHaveTextContent('74 ₽');
  });
  it.each([null, () => null, () => undefined, () => '', () => false])(
    'hides empty values independently of marks and uses numeric bound Tooltips (%s)',
    (renderer) => {
      render(
        <SliderRange label="Сумма" defaultValue={[25, 75]} renderValue={renderer} showTooltip data-testid="root" />,
      );
      const [lower, upper] = screen.getAllByRole('slider');
      act(() => lower.focus());
      fireEvent.keyDown(lower, { key: 'ArrowRight' });
      fireEvent.change(lower, { target: { value: '26' } });
      expect(lower).toHaveValue('26');
      expect(upper).toHaveValue('75');
      expect(screen.getByTestId('root')).not.toHaveTextContent('26');
      expect(screen.getByTestId('root')).not.toHaveTextContent('75');
      expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['0', '100']);
      expect(screen.getByRole('tooltip')).toHaveTextContent('26');
      fireEvent.keyUp(lower, { key: 'ArrowRight' });
      act(() => {
        lower.blur();
        upper.focus();
      });
      fireEvent.keyDown(upper, { key: 'ArrowLeft' });
      fireEvent.change(upper, { target: { value: '74' } });
      expect(screen.getByRole('tooltip')).toHaveTextContent('74');
    },
  );
  it.each([null, () => null])('hides marks independently of visible interval values (%s)', (renderMarks) => {
    render(<SliderRange label="Сумма" defaultValue={[25, 75]} renderMarks={renderMarks} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('25 — 75')).toBeVisible();
  });
  it('does not create empty value or scale rows', () => {
    const { container } = render(<SliderRange label="Сумма" renderValue={null} renderMarks={() => null} />);
    expect(container.querySelector(`.${SliderValue.styledComponentId}`)).not.toBeInTheDocument();
    expect(container.querySelectorAll(`.${SliderTextRow.styledComponentId}`)).toHaveLength(1);
  });
  it('renders zero for both bound values and Tooltips while preserving native values', () => {
    render(<SliderRange label="Сумма" defaultValue={[25, 75]} renderValue={() => 0} renderMarks={null} showTooltip />);
    const [lower, upper] = screen.getAllByRole('slider');
    expect(screen.getByText('0 — 0')).toBeVisible();
    for (const [input, key, next] of [
      [lower, 'ArrowRight', '26'],
      [upper, 'ArrowLeft', '74'],
    ] as const) {
      act(() => input.focus());
      fireEvent.keyDown(input, { key });
      fireEvent.change(input, { target: { value: next } });
      fireEvent.keyUp(input, { key });
      expect(screen.getByRole('tooltip')).toHaveTextContent(/^0$/);
      expect(screen.getByText('0 — 0')).toBeVisible();
      act(() => input.blur());
    }
    expect(lower).toHaveValue('26');
    expect(upper).toHaveValue('74');
  });
  it.each([0, 1])(
    'renders only one bound without a separator and uses numeric Tooltip for hidden bound %s',
    (hiddenBound) => {
      render(
        <SliderRange
          data-testid="root"
          label="Интервал"
          defaultValue={[25, 75]}
          showTooltip
          renderValue={(value) => ((hiddenBound === 0 ? value < 50 : value > 50) ? null : <strong>{value} ₽</strong>)}
        />,
      );
      const visibleValue = hiddenBound === 0 ? '75 ₽' : '25 ₽';
      const value = screen.getByText(visibleValue);
      expect(value.tagName).toBe('STRONG');
      expect(screen.getByTestId('root')).not.toHaveTextContent('—');
      const input = screen.getAllByRole('slider')[hiddenBound];
      const key = hiddenBound === 0 ? 'ArrowRight' : 'ArrowLeft';
      const next = hiddenBound === 0 ? '26' : '74';
      act(() => input.focus());
      fireEvent.keyDown(input, { key });
      fireEvent.change(input, { target: { value: next } });
      fireEvent.keyUp(input, { key });
      expect(screen.getByRole('tooltip')).toHaveTextContent(next);
      expect(value).toHaveTextContent(visibleValue);
      expect(screen.getByTestId('root')).not.toHaveTextContent('—');
    },
  );
  it('separates coincident bounds through endpoint labels without crossing', () => {
    render(<SliderRange defaultValue={[40, 40]} />);
    const [lower, upper] = screen.getAllByRole('slider');
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(lower).toHaveValue('40');
    expect(upper).toHaveValue('100');
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(lower).toHaveValue('0');
    expect(upper).toHaveValue('100');
  });
  it('keeps controlled label changes with the owner and blocks disabled labels', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SliderRange value={[25, 75]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(onChange).toHaveBeenLastCalledWith([0, 75]);
    expect(screen.getAllByRole('slider')[0]).toHaveValue('25');
    onChange.mockClear();
    rerender(<SliderRange disabled value={[25, 75]} onChange={onChange} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
      fireEvent.click(button);
    }
    expect(onChange).not.toHaveBeenCalled();
  });
});
