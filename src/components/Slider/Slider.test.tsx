import { createRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Slider } from './Slider';
import { SliderIcon, SliderLabel, SliderTextRow, SliderValue } from '../_internal/SliderAtoms';

const change = (value: string) => fireEvent.change(screen.getByRole('slider'), { target: { value } });
const keyboardChange = (value: string) => {
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
  change(value);
  fireEvent.keyUp(screen.getByRole('slider'), { key: 'ArrowRight' });
};

describe('Slider', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });
  it.each(['continuous', 'marked'] as const)(
    'does not grow the stylesheet when visiting new values on a %s track',
    (trackType) => {
      const values = [0, 1, 12_345, 250_000, 500_000, 750_000, 999_999, 1_000_000];
      const marks = trackType === 'marked' ? values : undefined;
      const props = { max: 1_000_000, marks };
      const { rerender } = render(<Slider {...props} value={500_000} />);
      const countRules = () =>
        Array.from(document.styleSheets).reduce((count, sheet) => count + sheet.cssRules.length, 0);
      const initialRuleCount = countRules();

      for (const value of [0, 1, 12_345, 250_000, 750_000, 999_999, 1_000_000]) {
        rerender(<Slider {...props} value={value} />);
        expect(screen.getByRole('slider')).toHaveValue(String(value));
        expect(countRules()).toBe(initialRuleCount);
      }
    },
  );
  it('renders a native range and forwards root and input refs', () => {
    const ref = createRef<HTMLDivElement>();
    const nativeSliderRef = createRef<HTMLInputElement>();
    render(
      <Slider ref={ref} nativeSliderRef={nativeSliderRef} label="Громкость" defaultValue={50} data-testid="root" />,
    );
    const input = screen.getByRole('slider', { name: 'Громкость' });
    expect(input).toHaveAttribute('type', 'range');
    expect(input).toHaveValue('50');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(nativeSliderRef.current).toBe(input);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('keeps container and native attributes and handlers separate', () => {
    const focused: EventTarget[] = [];
    const keyed: EventTarget[] = [];
    render(
      <Slider
        id="volume-control"
        className="volume-control"
        aria-label="Настройка громкости"
        data-testid="root"
        onFocus={(event) => focused.push(event.currentTarget)}
        onKeyDown={(event) => keyed.push(event.currentTarget)}
        nativeSliderProps={{
          id: 'volume-input',
          className: 'volume-input',
          name: 'volume',
          'data-testid': 'native',
          'aria-label': 'Громкость',
          tabIndex: 2,
          onFocus: (event) => focused.push(event.currentTarget),
          onKeyDown: (event) => keyed.push(event.currentTarget),
        }}
      />,
    );
    const root = screen.getByTestId('root');
    const input = screen.getByRole('slider', { name: 'Громкость' });
    expect(root).toHaveAttribute('id', 'volume-control');
    expect(root).toHaveAttribute('aria-label', 'Настройка громкости');
    expect(root).toHaveClass('volume-control');
    expect(root).not.toHaveAttribute('name');
    expect(input).toBe(screen.getByTestId('native'));
    expect(input).toHaveAttribute('id', 'volume-input');
    expect(input).toHaveAttribute('name', 'volume');
    expect(input).toHaveAttribute('tabindex', '2');
    expect(input).toHaveClass('volume-input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(focused).toEqual([input, root]);
    expect(keyed).toEqual([input, root]);
  });
  it('reports numeric changes and updates uncontrolled decorations', () => {
    const onChange = vi.fn();
    render(<Slider label="Значение" defaultValue={20} onChange={onChange} />);
    change('25');
    expect(onChange).toHaveBeenCalledWith(25);
    expect(screen.getByRole('slider')).toHaveValue('25');
    expect(screen.getByText('25')).toBeVisible();
  });
  it('associates the native label with the input while preserving the container id', () => {
    render(<Slider id="volume" nativeSliderProps={{ id: 'volume-input' }} label="Громкость" />);
    const input = screen.getByLabelText('Громкость') as HTMLInputElement;
    expect(input.id).toBe('volume-input');
    expect(input.labels?.[0]).toHaveAttribute('for', 'volume-input');
    expect(input.parentElement?.closest('#volume')).toBeInTheDocument();
  });
  it('generates distinct input ids for standalone sliders', () => {
    render(
      <>
        <Slider label="Первый" />
        <Slider label="Второй" />
      </>,
    );
    const first = screen.getByLabelText('Первый');
    const second = screen.getByLabelText('Второй');
    expect(first.id).not.toBe(second.id);
    expect(first.id).not.toBe('');
  });
  it('keeps a controlled value until the owner updates it', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Slider value={20} onChange={onChange} />);
    change('21');
    expect(onChange).toHaveBeenCalledWith(21);
    expect(screen.getByRole('slider')).toHaveValue('20');
    rerender(<Slider value={60} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveValue('60');
  });
  it('normalizes incoming values to native range bounds and step', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Slider value={200} step={10} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveValue('100');
    rerender(<Slider value={24} step={10} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveValue('20');
    rerender(<Slider min={0.1} max={1} step={0.1} value={0.3} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveValue('0.3');
    expect(onChange).not.toHaveBeenCalled();
  });
  it('renormalizes an edited uncontrolled value when bounds and step change without emitting onChange', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Slider label="Значение" defaultValue={50} onChange={onChange} />);
    change('73');
    onChange.mockClear();
    rerender(<Slider label="Значение" min={20} max={60} step={10} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveValue('60');
    expect(screen.getByText('60', { selector: 'span' })).toBeVisible();
    rerender(<Slider label="Значение" min={20} max={120} step={20} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveValue('80');
    expect(screen.getByText('80')).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();
  });
  it.each([
    { min: NaN, max: Infinity, step: NaN, value: NaN, expectedMax: '0' },
    { min: 0, max: 100, step: -2, value: NaN, expectedMax: '100' },
  ])('normalizes nonfinite bounds, value and invalid step ($expectedMax)', ({ expectedMax, ...props }) => {
    const onChange = vi.fn();
    render(<Slider {...props} onChange={onChange} />);
    const input = screen.getByRole('slider');
    expect(input).toHaveValue('0');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', expectedMax);
    expect(input).toHaveAttribute('step', '1');
    expect(onChange).not.toHaveBeenCalled();
  });
  it('uses the last valid step when max is off-step', () => {
    render(<Slider max={103} step={10} defaultValue={103} />);
    expect(screen.getByRole('slider')).toHaveValue('100');
  });
  it('blocks disabled changes while preserving the requested tabIndex', () => {
    const onChange = vi.fn();
    render(<Slider disabled nativeSliderProps={{ tabIndex: 0 }} onChange={onChange} showTooltip />);
    expect(screen.getByRole('slider')).toBeDisabled();
    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '0');
    change('20');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('keeps an empty range focusable without disabling it or changing its value', () => {
    const onChange = vi.fn();
    render(<Slider min={20} max={20} onChange={onChange} data-testid="root" />);
    const input = screen.getByRole('slider');
    expect(input).toHaveValue('20');
    expect(input).toBeEnabled();
    expect(input).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('root')).not.toHaveAttribute('data-disabled');
    expect(screen.getByTestId('root')).not.toHaveAttribute('aria-disabled');
    act(() => input.focus());
    expect(input).toHaveFocus();
    keyboardChange('20');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeEnabled();
      fireEvent.click(button);
    }
    expect(input).toHaveValue('20');
    expect(onChange).not.toHaveBeenCalled();
  });
  it('forwards accessible names and descriptions to the input', () => {
    render(
      <>
        <p id="help">Описание</p>
        <Slider label="Подпись" nativeSliderProps={{ 'aria-label': 'Имя', 'aria-describedby': 'help' }} />
      </>,
    );
    expect(screen.getByRole('slider', { name: 'Имя' })).toHaveAccessibleDescription('Описание');
  });
  it('formats visible and accessible values and hides optional rows', () => {
    const { rerender } = render(<Slider label="Сумма" defaultValue={50} renderValue={(value) => `${value} ₽`} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '50 ₽');
    expect(screen.getByText('50 ₽')).toBeVisible();
    rerender(<Slider label="Сумма" renderValue={null} renderMarks={null} />);
    expect(screen.queryByText('50')).not.toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });
  it('does not create empty label/value/icon rows', () => {
    const { container } = render(<Slider label="" renderMarks={null} iconStart={false} iconEnd="" />);
    for (const component of [SliderTextRow, SliderLabel, SliderValue, SliderIcon]) {
      expect(container.querySelector(`.${component.styledComponentId}`)).not.toBeInTheDocument();
    }
  });
  it('renders JSX values in the value and Tooltip while preserving native accessibility', () => {
    const props = {
      label: 'Сумма',
      defaultValue: 50,
      showTooltip: true,
      renderValue: (value: number) => <strong>{value} ₽</strong>,
    };
    const { rerender } = render(<Slider {...props} />);
    const input = screen.getByRole('slider');
    expect(input).toHaveValue('50');
    expect(input).not.toHaveAttribute('aria-valuetext');
    expect(screen.getByText('50 ₽').tagName).toBe('STRONG');
    act(() => input.focus());
    keyboardChange('51');
    expect(screen.getByRole('tooltip').querySelector('strong')).toHaveTextContent('51 ₽');
    rerender(<Slider {...props} nativeSliderProps={{ 'aria-valuetext': 'Пятьдесят один рубль' }} />);
    expect(input).toHaveAttribute('aria-valuetext', 'Пятьдесят один рубль');
  });
  it.each([null, () => null, () => undefined, () => '', () => false])(
    'hides empty upper value and falls back to a numeric Tooltip (%s)',
    (renderValue) => {
      const { getByTestId } = render(
        <Slider label="Сумма" defaultValue={50} showTooltip renderValue={renderValue} data-testid="root" />,
      );
      const input = screen.getByRole('slider');
      act(() => input.focus());
      keyboardChange('51');
      expect(input).toHaveValue('51');
      expect(input).toBeEnabled();
      expect(getByTestId('root')).not.toHaveTextContent('51');
      expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['0', '100']);
      expect(screen.getByRole('tooltip')).toHaveTextContent('51');
    },
  );
  it('renders zero content in the value and Tooltip without replacing it with the current number', () => {
    render(<Slider label="Сумма" defaultValue={50} renderValue={() => 0} renderMarks={null} showTooltip />);
    expect(screen.getByText('0')).toBeVisible();
    act(() => screen.getByRole('slider').focus());
    keyboardChange('51');
    expect(screen.getByRole('slider')).toHaveValue('51');
    expect(screen.getByRole('tooltip')).toHaveTextContent(/^0$/);
  });
  it('renders unique boundary and mark labels independently of selectable values', () => {
    const renderMarks = vi.fn((value: number) => <span>{value} ₽</span>);
    render(<Slider marks={[75, 25, 25]} renderMarks={renderMarks} />);
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['0 ₽', '25 ₽', '75 ₽', '100 ₽']);
    expect(renderMarks.mock.calls.map(([value]) => value)).toEqual([0, 25, 75, 100]);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' });
    expect(screen.getByRole('slider')).toHaveValue('75');
  });
  it.each([null, () => null])('hides all lower labels while retaining discrete selection (%s)', (renderMarks) => {
    render(<Slider label="Сумма" marks={[10, 70]} renderMarks={renderMarks} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('10')).toBeVisible();
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(screen.getByRole('slider')).toHaveValue('70');
  });
  it.each([0, 100])('lets renderMarks hide endpoint %s without changing the numeric step', (hidden) => {
    render(<Slider defaultValue={50} renderMarks={(value) => (value === hidden ? null : <span>{value}</span>)} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: String(hidden) })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: String(100 - hidden) })).toBeVisible();
    keyboardChange('51');
    expect(screen.getByRole('slider')).toHaveValue('51');
  });
  it('shows optional Tooltip for two seconds after a keyboard change', () => {
    vi.useFakeTimers();
    render(<Slider showTooltip />);
    act(() => screen.getByRole('slider').focus());
    keyboardChange('1');
    expect(screen.getByRole('tooltip')).toHaveTextContent('1');
    act(() => vi.advanceTimersByTime(1500));
    keyboardChange('2');
    act(() => vi.advanceTimersByTime(1999));
    expect(screen.getByRole('tooltip')).toHaveTextContent('2');
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('completely disables Tooltip when the consumer turns it off', () => {
    const { rerender } = render(<Slider showTooltip />);
    act(() => screen.getByRole('slider').focus());
    keyboardChange('1');
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    rerender(<Slider showTooltip={false} />);
    change('2');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('restores the native value and displayed value after reset', () => {
    vi.useFakeTimers();
    render(
      <>
        <form id="settings" data-testid="form" />
        <Slider nativeSliderProps={{ form: 'settings', name: 'volume' }} label="Громкость" defaultValue={50} />
      </>,
    );
    change('75');
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(new FormData(form).get('volume')).toBe('75');
    expect(screen.getByText('75')).toBeVisible();
    act(() => form.reset());
    act(() => vi.runOnlyPendingTimers());
    expect(screen.getByRole('slider')).toHaveValue('50');
    expect(screen.getByText('50')).toBeVisible();
  });
  it('preserves the native value and displayed value after cancelled reset', () => {
    vi.useFakeTimers();
    render(
      <form data-testid="form" onReset={(event) => event.preventDefault()}>
        <Slider label="Громкость" defaultValue={50} />
      </form>,
    );
    change('75');
    act(() => (screen.getByTestId('form') as HTMLFormElement).reset());
    expect(screen.getByRole('slider')).toHaveValue('75');
    expect(screen.getByText('75')).toBeVisible();
    act(() => vi.runOnlyPendingTimers());
    expect(screen.getByRole('slider')).toHaveValue('75');
    expect(screen.getByText('75')).toBeVisible();
  });
  it('renders boundary labels without adding them to selectable marks', () => {
    render(
      <Slider
        label="Сумма"
        marks={[10, 70]}
        renderMarks={(value) => (value === 10 ? 'Десять' : String(value))}
        defaultValue={40}
      />,
    );
    change('41');
    expect(screen.getByRole('slider')).toHaveValue('70');
    expect(screen.getByText('Десять')).toBeVisible();
    expect(screen.getByRole('button', { name: '0' })).toBeVisible();
    expect(screen.getByRole('button', { name: '100' })).toBeVisible();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemin', '10');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '70');
  });
  it('restricts pointer changes to the supplied marks without adding min and max', () => {
    render(<Slider marks={[10, 40, 70]} defaultValue={40} />);
    change('59');
    expect(screen.getByRole('slider')).toHaveValue('70');
    change('99');
    expect(screen.getByRole('slider')).toHaveValue('70');
    change('1');
    expect(screen.getByRole('slider')).toHaveValue('10');
  });
  it('moves between nonuniform marks with the keyboard and honors cancellation', () => {
    const cancel = vi.fn((event) => event.preventDefault());
    const { rerender } = render(<Slider label="Сумма" marks={[10, 40, 70]} defaultValue={10} />);
    const input = screen.getByRole('slider');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(input).toHaveValue('40');
    fireEvent.keyDown(input, { key: 'End' });
    expect(input).toHaveValue('70');
    rerender(<Slider marks={[10, 40, 70]} nativeSliderProps={{ onKeyDown: cancel }} />);
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input).toHaveValue('70');
  });
  it('keeps controlled keyboard selection at the supplied mark until the owner updates it', () => {
    const onChange = vi.fn();
    const marks = [10, 40, 70];
    const { rerender } = render(<Slider marks={marks} value={10} onChange={onChange} />);
    const input = screen.getByRole('slider');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyUp(input, { key: 'ArrowRight' });
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 40);
    expect(onChange).toHaveBeenNthCalledWith(2, 40);
    expect(input).toHaveValue('10');
    rerender(<Slider marks={marks} value={40} onChange={onChange} />);
    expect(input).toHaveValue('40');
  });
  it('shows Tooltip after keyboard selection of a mark and hides it after two seconds', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Slider marks={[10, 40]} defaultValue={10} showTooltip onChange={onChange} />);
    const input = screen.getByRole('slider');
    act(() => input.focus());
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyUp(input, { key: 'ArrowRight' });
    expect(input).toHaveValue('40');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(40);
    expect(screen.getByRole('tooltip')).toHaveTextContent('40');
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('normalizes initial restricted values and supports custom zero labels', () => {
    render(
      <Slider
        marks={[0, 10, 70, 500, NaN, 10]}
        defaultValue={50}
        renderMarks={(value) => (value === 0 ? 0 : value === 500 ? 'Outside' : String(value))}
      />,
    );
    expect(screen.getByRole('slider')).toHaveValue('70');
    expect(screen.getByText('0')).toBeVisible();
    expect(screen.queryByText('Outside')).not.toBeInTheDocument();
  });
  it('keeps an uncontrolled native value aligned when marks restrict an existing selection', () => {
    const { rerender } = render(<Slider defaultValue={40} />);
    change('50');
    rerender(<Slider defaultValue={40} marks={[10, 70]} />);
    expect(screen.getByRole('slider')).toHaveValue('70');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '70');
  });
  it('selects scale bounds, focuses the input and avoids duplicate changes or form submission', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form data-testid="form" onSubmit={onSubmit}>
        <Slider nativeSliderProps={{ name: 'volume' }} defaultValue={50} onChange={onChange} />
      </form>,
    );
    const input = screen.getByRole('slider');
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(input).toHaveValue('100');
    expect(input).toHaveFocus();
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('volume')).toBe('100');
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(input).toHaveValue('0');
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it('uses exact marks even when they do not match the numeric step', () => {
    render(<Slider step={10} marks={[25, 75]} renderMarks={(value) => (value === 25 ? 'Четверть' : String(value))} />);
    fireEvent.click(screen.getByRole('button', { name: 'Четверть' }));
    expect(screen.getByRole('slider')).toHaveValue('25');
    change('30');
    expect(screen.getByRole('slider')).toHaveValue('25');
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(screen.getByRole('slider')).toHaveValue('75');
  });
  it('uses the numeric step when marks are empty or outside the range', () => {
    const { rerender } = render(<Slider step={10} marks={[]} defaultValue={40} />);
    change('49');
    expect(screen.getByRole('slider')).toHaveValue('50');
    rerender(<Slider step={10} marks={[-10, 101]} />);
    change('61');
    expect(screen.getByRole('slider')).toHaveValue('60');
    expect(screen.getByRole('button', { name: '0' })).toBeVisible();
    expect(screen.getByRole('button', { name: '100' })).toBeVisible();
  });
  it('keeps controlled selection with its owner and disables all scale buttons', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Slider value={50} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(onChange).toHaveBeenLastCalledWith(100);
    expect(screen.getByRole('slider')).toHaveValue('50');
    onChange.mockClear();
    rerender(<Slider value={50} disabled marks={[25]} onChange={onChange} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
      fireEvent.click(button);
    }
    expect(onChange).not.toHaveBeenCalled();
  });
});
