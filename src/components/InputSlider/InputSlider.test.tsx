import { createRef, useState, type FocusEvent } from 'react';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { INPUT_SLIDER_DIMENSIONS } from './constants';
import { InputSlider } from './InputSlider';
import { FormItem } from '../FormItem';

const input = () => screen.getByRole('textbox') as HTMLInputElement;
const slider = () => screen.getByRole('slider');

describe('InputSlider', () => {
  afterEach(cleanup);

  it('forwards root attributes/ref to div and native props/refs to their inputs', () => {
    const ref = createRef<HTMLDivElement>();
    const nativeInputRef = createRef<HTMLInputElement>();
    const nativeSliderRef = createRef<HTMLInputElement>();
    const { unmount } = render(
      <InputSlider
        ref={ref}
        nativeInputRef={nativeInputRef}
        nativeSliderRef={nativeSliderRef}
        data-testid="root"
        id="composition"
        aria-label="Composition"
        inputProps={{ id: 'amount', 'aria-label': 'Amount', suffix: '₽' }}
        sliderProps={{ nativeSliderProps: { id: 'range' } }}
        name="amount"
        defaultValue="25"
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current).toHaveAttribute('id', 'composition');
    expect(nativeInputRef.current).toBe(input());
    expect(nativeSliderRef.current).toBe(slider());
    expect(input()).toHaveAttribute('id', 'amount');
    expect(input()).not.toHaveAttribute('name');
    expect(input()).toHaveAccessibleName('Amount');
    expect(slider()).toHaveAttribute('id', 'range');
    expect(slider()).toHaveAccessibleName('Amount');
    expect(slider()).not.toHaveAttribute('name');
    expect(screen.getByText('₽')).toBeInTheDocument();
    expect(input().value).toBe('25');
    expect(slider()).toHaveValue('25');
    unmount();
    expect(ref.current).toBeNull();
    expect(nativeInputRef.current).toBeNull();
    expect(nativeSliderRef.current).toBeNull();
  });

  it('preserves out-of-range text without committing or submitting the previous number', () => {
    const changes: string[] = [];
    render(
      <form data-testid="form">
        <InputSlider name="amount" max={100} defaultValue="20" onValueChange={(value) => changes.push(value)} />
      </form>,
    );
    fireEvent.input(input(), { target: { value: '120' } });
    expect(input().value).toBe('120');
    expect(input()).toBeInvalid();
    expect(input()).toHaveAttribute('type', 'text');
    expect(slider()).toHaveValue('20');
    expect(changes).toEqual([]);
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('amount')).toBe('');
    fireEvent.blur(input());
    expect(input().value).toBe('100');
    expect(changes).toEqual(['100']);
    expect(input()).toBeValid();
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('amount')).toBe('100');
  });

  it('normalizes before forwarding input blur and bubbling to the root', () => {
    const onInputBlur = vi.fn((event: FocusEvent<HTMLInputElement>) => expect(event.currentTarget.value).toBe('100'));
    const onRootBlur = vi.fn();
    render(<InputSlider defaultValue="25" onBlur={onRootBlur} inputProps={{ onBlur: onInputBlur }} />);
    fireEvent.input(input(), { target: { value: '200' } });
    fireEvent.blur(input());
    expect(input().value).toBe('100');
    expect(onInputBlur).toHaveBeenCalledOnce();
    expect(onRootBlur).toHaveBeenCalledOnce();
  });

  it('keeps the previous slider position while the numeric field is empty', () => {
    const onValueChange = vi.fn();
    render(<InputSlider defaultValue="20" onValueChange={onValueChange} />);
    fireEvent.input(input(), { target: { value: '' } });
    expect(input().value).toBe('');
    expect(slider()).toHaveValue('20');
    expect(onValueChange).toHaveBeenCalledOnce();
    fireEvent.blur(input());
    expect(input().value).toBe('');
  });

  it('keeps fractional input intact while Slider follows its allowed step', () => {
    render(<InputSlider min={0} max={2} step={0.1} />);
    fireEvent.input(input(), { target: { value: '1.26' } });
    expect(input().value).toBe('1.26');
    expect(input()).toBeValid();
    expect(slider()).toHaveValue('1.3');
    fireEvent.blur(input());
    expect(input().value).toBe('1.26');
  });

  it('keeps formatted text separate from canonical string callbacks and native form data', () => {
    const changes: string[] = [];
    const formatValue = vi.fn((value: number) => value.toFixed(2).replace('.', ','));
    const parseValue = (value: string) => {
      if (!value.trim()) return null;
      return Number(value.replaceAll(' ', '').replace(',', '.'));
    };
    render(
      <form data-testid="form">
        <InputSlider
          defaultValue="10000.5"
          max={20_000}
          step={0.01}
          parseValue={parseValue}
          formatValue={formatValue}
          name="amount"
          onValueChange={(value) => changes.push(value)}
        />
      </form>,
    );
    formatValue.mockClear();
    expect(slider()).toHaveValue('10000.5');
    fireEvent.input(input(), { target: { value: '12 000,25' } });
    fireEvent.blur(input());
    expect(input().value).toBe('12 000,25');
    expect(slider()).toHaveValue('12000.25');
    expect(input()).toBeValid();
    fireEvent.input(input(), { target: { value: '-' } });
    expect(slider()).toHaveValue('12000.25');
    fireEvent.change(slider(), { target: { value: '15000' } });
    expect(input().value).toBe('15000,00');
    expect(formatValue).toHaveBeenCalledWith(15000);
    expect(changes).toEqual(['12000.25', '15000']);
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).getAll('amount')).toEqual(['15000']);
  });

  it('initializes from formatted min and synchronizes uncontrolled onInput with a custom parser', () => {
    const onInput = vi.fn();
    render(
      <InputSlider
        min={10}
        formatValue={(value) => `${value} ₽`}
        parseValue={(value) => (value === '' ? null : Number(value.replace(' ₽', '')))}
        inputProps={{ onInput }}
      />,
    );
    expect(input().value).toBe('10 ₽');
    fireEvent.input(input(), { target: { value: '25 ₽' } });
    expect(slider()).toHaveValue('25');
    expect(onInput).toHaveBeenCalledOnce();
    fireEvent.input(input(), { target: { value: '' } });
    expect(slider()).toHaveValue('25');
  });

  it('separates canonical string changes from genuine visible input events', () => {
    const nativeInputRef = createRef<HTMLInputElement>();
    const nativeChanges: string[] = [];
    const nativeInputs: string[] = [];
    const onValueChange = vi.fn();
    render(
      <InputSlider
        defaultValue="20"
        nativeInputRef={nativeInputRef}
        onValueChange={onValueChange}
        formatValue={(value) => value.toFixed(2).replace('.', ',')}
        parseValue={(text) => Number(text.replace(',', '.'))}
        inputProps={{
          onChange: (event) => {
            expect(event.target).toBe(nativeInputRef.current);
            expect(event.currentTarget).toBe(nativeInputRef.current);
            nativeChanges.push(event.currentTarget.value);
          },
          onInput: (event) => nativeInputs.push(event.currentTarget.value),
        }}
      />,
    );
    fireEvent.input(input(), { target: { value: '25,50' } });
    expect(onValueChange.mock.calls).toEqual([['25.5']]);
    expect(nativeChanges).toEqual(['25,50']);
    expect(nativeInputs).toEqual(['25,50']);
    fireEvent.change(slider(), { target: { value: '30' } });
    expect(input().value).toBe('30,00');
    expect(onValueChange.mock.calls).toEqual([['25.5'], ['30']]);
    expect(nativeChanges).toEqual(['25,50']);
    expect(nativeInputs).toEqual(['25,50']);
  });

  it('parses the restored formatted defaultValue after a native form reset', async () => {
    render(
      <form data-testid="form">
        <InputSlider
          defaultValue="25"
          parseValue={(value) => Number(value.replace(' ₽', ''))}
          formatValue={(value) => `${value} ₽`}
        />
      </form>,
    );
    fireEvent.change(slider(), { target: { value: '50' } });
    expect(input().value).toBe('50 ₽');
    (screen.getByTestId('form') as HTMLFormElement).reset();
    await waitFor(() => expect(slider()).toHaveValue('25'));
    expect(input().value).toBe('25 ₽');
  });

  it('submits exactly one canonical value even when readOnly unmounts Slider', () => {
    const { rerender } = render(
      <form data-testid="form">
        <InputSlider
          name="amount"
          defaultValue="25"
          formatValue={(value) => `${value} ₽`}
          parseValue={(text) => Number(text.replace(' ₽', ''))}
        />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(input()).not.toHaveAttribute('name');
    expect(slider()).not.toHaveAttribute('name');
    expect(new FormData(form).getAll('amount')).toEqual(['25']);
    rerender(
      <form data-testid="form">
        <InputSlider
          name="amount"
          defaultValue="25"
          readOnly
          formatValue={(value) => `${value} ₽`}
          parseValue={(text) => Number(text.replace(' ₽', ''))}
        />
      </form>,
    );
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(input().value).toBe('25 ₽');
    expect(new FormData(form).getAll('amount')).toEqual(['25']);
  });

  it('serializes empty and invalid text as empty but blocks submit only when required or invalid', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <form data-testid="form">
        <InputSlider name="amount" defaultValue="" onValueChange={onValueChange} />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(input().value).toBe('');
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).getAll('amount')).toEqual(['']);
    fireEvent.input(input(), { target: { value: '-' } });
    expect(input()).toBeInvalid();
    expect(new FormData(form).get('amount')).toBe('');
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.input(input(), { target: { value: '25' } });
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('amount')).toBe('25');
    fireEvent.input(input(), { target: { value: '' } });
    expect(form.checkValidity()).toBe(true);
    expect(onValueChange.mock.calls).toEqual([['25'], ['']]);
    rerender(
      <form data-testid="form">
        <InputSlider name="amount" required defaultValue="" onValueChange={onValueChange} />
      </form>,
    );
    expect(form.checkValidity()).toBe(false);
  });

  it('excludes disabled canonical controls including inherited fieldset and FormItem states', () => {
    const { rerender } = render(
      <form data-testid="form">
        <fieldset disabled>
          <InputSlider name="amount" defaultValue="25" />
        </fieldset>
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(new FormData(form).getAll('amount')).toEqual([]);
    rerender(
      <form data-testid="form">
        <FormItem disabled>
          <InputSlider name="amount" defaultValue="25" />
        </FormItem>
      </form>,
    );
    expect(new FormData(form).getAll('amount')).toEqual([]);
    rerender(
      <form data-testid="form">
        <InputSlider name="amount" disabled defaultValue="25" />
      </form>,
    );
    expect(new FormData(form).getAll('amount')).toEqual([]);
    rerender(
      <form data-testid="form">
        <InputSlider name="amount" defaultValue="25" />
      </form>,
    );
    expect(new FormData(form).getAll('amount')).toEqual(['25']);
  });

  it('associates validation, serialization and reset with an external native form', async () => {
    render(
      <>
        <form id="external" data-testid="form" />
        <InputSlider name="amount" form="external" defaultValue="25" />
      </>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(input().form).toBe(form);
    fireEvent.input(input(), { target: { value: '-' } });
    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get('amount')).toBe('');
    form.reset();
    await waitFor(() => expect(input().value).toBe('25'));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).getAll('amount')).toEqual(['25']);
  });

  it('honors cancelled reset and restores controlled values without emitting onValueChange', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <form data-testid="form" onReset={(event) => event.preventDefault()}>
        <InputSlider name="amount" value="25" onValueChange={onValueChange} />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    fireEvent.input(input(), { target: { value: '-' } });
    form.reset();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(input().value).toBe('-');
    rerender(
      <form data-testid="form">
        <InputSlider name="amount" value="25" onValueChange={onValueChange} />
      </form>,
    );
    form.reset();
    await waitFor(() => expect(input().value).toBe('25'));
    expect(new FormData(form).get('amount')).toBe('25');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('updates the text from Slider and emits canonical strings for marks too', () => {
    const changes: string[] = [];
    const nativeInputRef = createRef<HTMLInputElement>();
    const onValueChange = vi.fn((value: string) => changes.push(value));
    render(<InputSlider nativeInputRef={nativeInputRef} marks={[0, 25, 100]} onValueChange={onValueChange} />);
    fireEvent.change(slider(), { target: { value: '25' } });
    expect(input().value).toBe('25');
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(input().value).toBe('100');
    expect(slider()).toHaveValue('100');
    expect(changes).toEqual(['25', '100']);
  });

  it('initializes with the first valid mark and normalizes manual input on blur', () => {
    render(<InputSlider min={10} max={90} marks={[100, 70, 20, 20, NaN, -5]} />);
    expect(input().value).toBe('20');
    expect(slider()).toHaveValue('20');
    fireEvent.input(input(), { target: { value: '60' } });
    expect(slider()).toHaveValue('70');
    fireEvent.blur(input());
    expect(input().value).toBe('70');
    expect(input()).toBeValid();
  });

  it.each([
    ['80', '100'],
    ['25', '50'],
    ['-10', '0'],
    ['140', '100'],
  ])('normalizes formatted marks input %s to %s before native submit', (typed, expected) => {
    const onValueChange = vi.fn();
    const submitted = vi.fn();
    render(
      <form
        data-testid="form"
        onSubmit={(event) => {
          event.preventDefault();
          submitted(new FormData(event.currentTarget).getAll('amount'));
        }}
      >
        <InputSlider
          name="amount"
          defaultValue="50"
          marks={[0, 50, 100]}
          onValueChange={onValueChange}
          formatValue={(value) => `${value} ₽`}
          parseValue={(text) => Number(text.replace(' ₽', ''))}
        />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    fireEvent.input(input(), { target: { value: `${typed} ₽` } });
    expect(input().value).toBe(`${typed} ₽`);
    expect(slider()).toHaveValue(expected);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(new FormData(form).get('amount')).toBe('');
    form.requestSubmit();
    expect(submitted).not.toHaveBeenCalled();
    fireEvent.blur(input());
    expect(input().value).toBe(`${expected} ₽`);
    expect(input()).toBeValid();
    expect(onValueChange.mock.calls).toEqual(expected === '50' ? [] : [[expected]]);
    form.requestSubmit();
    expect(submitted.mock.calls).toEqual([[[expected]]]);
  });

  it('keeps cleared marks input empty and retains the displayed position after blur', () => {
    const onValueChange = vi.fn();
    render(<InputSlider defaultValue="50" marks={[0, 50, 100]} onValueChange={onValueChange} />);
    fireEvent.input(input(), { target: { value: '80' } });
    expect(slider()).toHaveValue('100');
    fireEvent.input(input(), { target: { value: '-' } });
    expect(slider()).toHaveValue('100');
    fireEvent.input(input(), { target: { value: '' } });
    fireEvent.blur(input());
    expect(input().value).toBe('');
    expect(slider()).toHaveValue('100');
    expect(onValueChange.mock.calls).toEqual([['']]);
  });

  it('respects a controlled owner that rejects blur normalization', () => {
    const onValueChange = vi.fn();
    render(
      <form data-testid="form">
        <InputSlider name="amount" value="50" marks={[0, 50, 100]} onValueChange={onValueChange} />
      </form>,
    );
    fireEvent.input(input(), { target: { value: '80' } });
    fireEvent.blur(input());
    expect(onValueChange.mock.calls).toEqual([['100']]);
    expect(input().value).toBe('50');
    expect(slider()).toHaveValue('50');
    expect(input()).toBeValid();
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('amount')).toBe('50');
  });

  it('clamps a number below min on blur without rounding in-range values by step', () => {
    const onValueChange = vi.fn();
    render(<InputSlider min={10} max={100} step={3} defaultValue="40" onValueChange={onValueChange} />);
    fireEvent.input(input(), { target: { value: '-20' } });
    fireEvent.blur(input());
    expect(input().value).toBe('10');
    expect(onValueChange.mock.calls).toEqual([['10']]);
    fireEvent.input(input(), { target: { value: '11.5' } });
    fireEvent.blur(input());
    expect(input().value).toBe('11.5');
    expect(onValueChange.mock.calls).toEqual([['10'], ['11.5']]);
  });

  it('supports controlled string values and remembers the external number when cleared', () => {
    const Controlled = () => {
      const [value, setValue] = useState('20');
      return (
        <>
          <InputSlider value={value} onValueChange={setValue} />
          <button onClick={() => setValue('30')}>Update</button>
        </>
      );
    };
    render(<Controlled />);
    fireEvent.input(input(), { target: { value: '025' } });
    expect(input().value).toBe('025');
    expect(slider()).toHaveValue('25');
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));
    expect(input().value).toBe('30');
    fireEvent.input(input(), { target: { value: '' } });
    expect(input().value).toBe('');
    expect(slider()).toHaveValue('30');
  });

  it('respects a controlled owner that rejects changes from either native input', () => {
    const changes: string[] = [];
    render(<InputSlider value="20" onValueChange={(value) => changes.push(value)} />);
    fireEvent.input(input(), { target: { value: '30' } });
    expect(input().value).toBe('20');
    expect(slider()).toHaveValue('20');
    fireEvent.change(slider(), { target: { value: '40' } });
    expect(input().value).toBe('20');
    expect(slider()).toHaveValue('20');
    expect(changes).toEqual(['30', '40']);
  });

  it('keeps the last accepted position if a controlled empty value rejects a Slider change', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<InputSlider value="25" onValueChange={onValueChange} />);
    rerender(<InputSlider value="" onValueChange={onValueChange} />);
    fireEvent.change(slider(), { target: { value: '30' } });
    expect(input().value).toBe('');
    expect(slider()).toHaveValue('25');
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it('updates Slider for new bounds and marks while retaining the native input value', () => {
    const { rerender } = render(<InputSlider defaultValue="80" />);
    rerender(<InputSlider defaultValue="80" max={60} />);
    expect(input().value).toBe('80');
    expect(slider()).toHaveValue('60');
    rerender(<InputSlider defaultValue="80" max={60} marks={[10, 30]} />);
    expect(input().value).toBe('80');
    expect(slider()).toHaveValue('30');
  });

  it.each(INPUT_SLIDER_DIMENSIONS)('uses Input size %s and the corresponding Slider size', (dimension) => {
    render(<InputSlider dimension={dimension} />);
    expect(input().parentElement).toHaveAttribute('data-dimension', dimension);
    expect(slider().parentElement).toHaveStyle({ height: `${{ l: 24, m: 24, s: 20, xs: 16 }[dimension]}px` });
  });

  it.each(['error', 'success'] as const)('applies top-level %s status only to Input', (status) => {
    render(<InputSlider status={status} />);
    expect(input().parentElement).toHaveAttribute('data-status', status);
    if (status === 'error') expect(input()).toHaveAttribute('aria-invalid', 'true');
    else expect(input()).not.toHaveAttribute('aria-invalid');
    expect(slider()).not.toHaveAttribute('aria-invalid');
  });

  it('preserves FormItem required/status priority and text length limit', () => {
    const { rerender } = render(
      <FormItem status="success" maxLength={1}>
        <InputSlider status="error" required />
      </FormItem>,
    );
    expect(input()).not.toBeRequired();
    expect(input()).toHaveAttribute('maxlength', '1');
    expect(input()).not.toHaveAttribute('aria-invalid');
    rerender(
      <FormItem status="error" required>
        <InputSlider status="success" required={false} />
      </FormItem>,
    );
    expect(input()).toBeRequired();
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    fireEvent.input(input(), { target: { value: '' } });
    expect(input()).toBeInvalid();
  });

  it('uses FormItem dimension and disabled and hides Slider in readOnly, clearing its ref', () => {
    const nativeSliderRef = createRef<HTMLInputElement>();
    const { rerender } = render(
      <FormItem dimension="xs" disabled>
        <InputSlider nativeSliderRef={nativeSliderRef} dimension="l" />
      </FormItem>,
    );
    expect(input()).toBeDisabled();
    expect(slider()).toBeDisabled();
    expect(input().parentElement).toHaveAttribute('data-dimension', 'xs');
    rerender(
      <FormItem readOnly>
        <InputSlider value="50" nativeSliderRef={nativeSliderRef} />
      </FormItem>,
    );
    expect(input()).toHaveAttribute('readonly');
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(nativeSliderRef.current).toBeNull();
  });

  it('lets FormItem defaults override local disabled/readOnly/dimension', () => {
    render(
      <FormItem>
        <InputSlider dimension="xs" disabled readOnly />
      </FormItem>,
    );
    expect(input()).not.toBeDisabled();
    expect(input()).not.toHaveAttribute('readonly');
    expect(slider()).not.toBeDisabled();
    expect(input().parentElement).toHaveAttribute('data-dimension', 'm');
  });

  it('clears the field with an ordinary input change event and keeps it empty after blur', () => {
    const changes: string[] = [];
    const onClear = vi.fn();
    render(
      <InputSlider
        defaultValue="50"
        inputProps={{ showClearIcon: true, onClear }}
        onValueChange={(value) => changes.push(value)}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));
    expect(input().value).toBe('');
    expect(slider()).toHaveValue('50');
    expect(onClear).toHaveBeenCalledOnce();
    expect(changes).toEqual(['']);
    fireEvent.blur(input());
    expect(input().value).toBe('');
  });
});
