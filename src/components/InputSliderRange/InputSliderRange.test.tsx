import { createRef, useState, type FocusEvent } from 'react';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { INPUT_SLIDER_RANGE_DIMENSIONS } from './constants';
import { InputSliderRange } from './InputSliderRange';
import type { InputSliderRangeProps, InputSliderRangeValue } from './types';
import { FormItem } from '../FormItem';

const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const sliders = () => screen.getAllByRole('slider');
const form = () => screen.getByTestId('form') as HTMLFormElement;
const data = () => Object.fromEntries(new FormData(form()));
const renderForm = (props: InputSliderRangeProps = {}) =>
  render(
    <form data-testid="form">
      <InputSliderRange defaultValue={['25', '75']} lowerName="lower" upperName="upper" {...props} />
    </form>,
  );

afterEach(cleanup);

describe('InputSliderRange', () => {
  const dragLowerAcross = () => {
    const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 });
    Object.defineProperty(event, 'isPrimary', { value: true });
    const physicalLower = sliders()[0];
    fireEvent(physicalLower, event);
    fireEvent.change(physicalLower, { target: { value: '90' } });
    return physicalLower;
  };

  it('defaults minValueDistance to step and keeps transient coincident form values valid until release', () => {
    const changes: InputSliderRangeValue[] = [];
    renderForm({ step: 2, defaultValue: ['20', '40'], onValueChange: (value) => changes.push(value) });
    const input = sliders()[0];
    const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 });
    Object.defineProperty(event, 'isPrimary', { value: true });
    fireEvent(input, event);
    fireEvent.change(input, { target: { value: '40' } });
    expect(data()).toEqual({ lower: '40', upper: '40' });
    expect(form().checkValidity()).toBe(true);
    fireEvent.pointerUp(document);
    expect(data()).toEqual({ lower: '38', upper: '40' });
    expect(inputs()[0]).toHaveValue('38');
    expect(form().checkValidity()).toBe(true);
    expect(changes).toEqual([
      ['40', '40'],
      ['38', '40'],
    ]);
  });

  it.each([0, 1] as const)(
    'restores minValueDistance from fractional canonical values for bound %s on release',
    (bound) => {
      renderForm({ defaultValue: ['20.2', '30.8'], minValueDistance: 1 });
      const input = sliders()[bound];
      const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 });
      Object.defineProperty(event, 'isPrimary', { value: true });
      fireEvent(input, event);
      fireEvent.change(input, { target: { value: bound === 0 ? '30' : '21' } });
      fireEvent.pointerUp(document);
      expect(data()).toEqual(bound === 0 ? { lower: '29', upper: '30.8' } : { lower: '20.2', upper: '22' });
      expect(form().checkValidity()).toBe(true);
    },
  );

  it.each([
    { value: ['25', '95'] as const, bound: 0, target: '100', max: 100, step: 1, distance: 10, expected: ['90', '100'] },
    { value: ['5', '75'] as const, bound: 1, target: '0', max: 100, step: 1, distance: 10, expected: ['0', '10'] },
    {
      value: ['0.2', '0.85'] as const,
      bound: 0,
      target: '1',
      max: 1,
      step: 0.1,
      distance: 0.25,
      expected: ['0.7', '1'],
    },
    {
      value: ['0.15', '0.8'] as const,
      bound: 1,
      target: '0',
      max: 1,
      step: 0.1,
      distance: 0.25,
      expected: ['0', '0.3'],
    },
  ])(
    'keeps native data valid with an edge fallback after swapping to $target',
    ({ value, bound, target, max, step, distance, expected }) => {
      const onValueChange = vi.fn();
      renderForm({
        defaultValue: value,
        max,
        step,
        minValueDistance: distance,
        onValueChange,
        formatValue: (number) => `${number} RUB`,
        parseValue: (text) => Number(text.replace(' RUB', '')),
      });
      const input = sliders()[bound];
      const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 });
      Object.defineProperty(event, 'isPrimary', { value: true });
      fireEvent(input, event);
      fireEvent.change(input, { target: { value: target } });
      fireEvent.pointerCancel(document);
      expect(data()).toEqual({ lower: expected[0], upper: expected[1] });
      expect(form().checkValidity()).toBe(true);
      expect(inputs().map((input) => input.value)).toEqual(expected.map((number) => `${number} RUB`));
      expect(onValueChange).toHaveBeenLastCalledWith(expected);
      expect(onValueChange).toHaveBeenCalledTimes(2);
    },
  );

  it('supports an explicit zero minValueDistance and equality on blur', () => {
    renderForm({ minValueDistance: 0 });
    fireEvent.input(inputs()[0], { target: { value: '90' } });
    fireEvent.blur(inputs()[0]);
    expect(data()).toEqual({ lower: '75', upper: '75' });
    expect(form().checkValidity()).toBe(true);
  });

  it('caps an oversized gap to the selectable span and restores it on cancellation', () => {
    renderForm({ max: 1, step: 0.3, minValueDistance: 10, defaultValue: ['0', '0.9'] });
    const input = sliders()[1];
    const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 });
    Object.defineProperty(event, 'isPrimary', { value: true });
    fireEvent(input, event);
    fireEvent.change(input, { target: { value: '0.3' } });
    fireEvent.pointerCancel(document);
    expect(data()).toEqual({ lower: '0', upper: '0.9' });
    expect(form().checkValidity()).toBe(true);
  });

  it('validates custom minValueDistance and normalizes a typed bound before submission', () => {
    renderForm({ minValueDistance: 10 });
    fireEvent.input(inputs()[0], { target: { value: '70' } });
    expect(inputs()[0]).toBeInvalid();
    expect(data()).toEqual({ lower: '', upper: '75' });
    fireEvent.blur(inputs()[0]);
    expect(inputs()[0]).toHaveValue('65');
    expect(data()).toEqual({ lower: '65', upper: '75' });
    expect(form().checkValidity()).toBe(true);
  });

  it('keeps decimal precision for minValueDistance and typed blur limits', () => {
    renderForm({ min: 0, max: 1, step: 0.1, minValueDistance: 0.3, defaultValue: ['0.2', '0.6'] });
    fireEvent.input(inputs()[0], { target: { value: '0.55' } });
    fireEvent.blur(inputs()[0]);
    expect(data()).toEqual({ lower: '0.3', upper: '0.6' });
    expect(form().checkValidity()).toBe(true);
  });

  it('forwards sliderProps.allowSwap=false and clamps the dragged bound without changing roles', () => {
    const onValueChange = vi.fn();
    renderForm({ sliderProps: { allowSwap: false }, onValueChange });
    const physicalInput = dragLowerAcross();
    expect(physicalInput).toHaveAttribute('data-bound', 'lower');
    expect(data()).toEqual({ lower: '75', upper: '75' });
    expect(onValueChange).toHaveBeenLastCalledWith(['75', '75']);
  });

  it('transfers fractional canonical values and formatted text at pointer crossing', () => {
    renderForm({
      defaultValue: ['25.2', '75.26'],
      formatValue: (number) => `${number} RUB`,
      parseValue: (text) => Number(text.replace(' RUB', '')),
    });
    dragLowerAcross();
    expect(data()).toEqual({ lower: '75.26', upper: '90' });
    expect(inputs()[0]).toHaveValue('75.26 RUB');
    expect(inputs()[1]).toHaveValue('90 RUB');
    expect(form().checkValidity()).toBe(true);
  });

  it('transfers an empty boundary with its saved slider position when roles swap', () => {
    renderForm();
    fireEvent.input(inputs()[1], { target: { value: '' } });
    const physicalLower = dragLowerAcross();
    expect(data()).toEqual({ lower: '', upper: '90' });
    expect(inputs()[0]).toHaveValue('');
    expect(inputs()[1]).toHaveValue('90');
    expect(physicalLower).toHaveAttribute('data-bound', 'upper');
    expect(physicalLower).toHaveValue('90');
    expect(form().querySelector('input[data-bound=lower]')).toHaveValue('75');
  });

  it('preserves an unfinished peer draft when thumb roles swap', () => {
    renderForm();
    fireEvent.input(inputs()[1], { target: { value: '-' } });
    dragLowerAcross();
    expect(inputs()[0]).toHaveValue('-');
    expect(inputs()[0]).toBeInvalid();
    expect(data()).toEqual({ lower: '', upper: '90' });
  });

  it('keeps both roles and empty preview positions when a controlled owner rejects crossing', () => {
    const onValueChange = vi.fn();
    const { rerender } = renderForm({ value: ['25', '75'], onValueChange });
    rerender(
      <form data-testid="form">
        <InputSliderRange value={['25', '']} lowerName="lower" upperName="upper" onValueChange={onValueChange} />
      </form>,
    );
    const physicalLower = sliders()[0];
    const physicalUpper = sliders()[1];
    dragLowerAcross();
    expect(onValueChange).toHaveBeenCalledWith(['', '90']);
    expect(physicalLower).toHaveAttribute('data-bound', 'lower');
    expect(physicalUpper).toHaveAttribute('data-bound', 'upper');
    expect(physicalLower).toHaveValue('25');
    expect(physicalUpper).toHaveValue('75');
    expect(data()).toEqual({ lower: '25', upper: '' });
  });

  it('forwards root and four native refs, separate props and accessible names', () => {
    const ref = createRef<HTMLDivElement>();
    const lowerNativeInputRef = createRef<HTMLInputElement>();
    const upperNativeInputRef = createRef<HTMLInputElement>();
    const lowerNativeSliderRef = createRef<HTMLInputElement>();
    const upperNativeSliderRef = createRef<HTMLInputElement>();
    const { unmount } = render(
      <InputSliderRange
        ref={ref}
        data-testid="root"
        title="Interval"
        lowerNativeInputRef={lowerNativeInputRef}
        upperNativeInputRef={upperNativeInputRef}
        lowerNativeSliderRef={lowerNativeSliderRef}
        upperNativeSliderRef={upperNativeSliderRef}
        lowerInputProps={{ id: 'lower', 'aria-label': 'From', suffix: 'RUB' }}
        upperInputProps={{ id: 'upper', 'aria-label': 'To' }}
        sliderProps={{ lowerNativeSliderProps: { id: 'lower-slider' }, upperNativeSliderProps: { id: 'upper-slider' } }}
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current).toHaveAttribute('title', 'Interval');
    expect(lowerNativeInputRef.current).toBe(inputs()[0]);
    expect(upperNativeInputRef.current).toBe(inputs()[1]);
    expect(lowerNativeSliderRef.current).toBe(sliders()[0]);
    expect(upperNativeSliderRef.current).toBe(sliders()[1]);
    expect(inputs()[0]).toHaveAttribute('id', 'lower');
    expect(inputs()[1]).toHaveAttribute('id', 'upper');
    expect(sliders()[0]).toHaveAccessibleName('From');
    expect(sliders()[1]).toHaveAccessibleName('To');
    expect(sliders()[0]).toHaveAttribute('id', 'lower-slider');
    expect(sliders()[1]).toHaveAttribute('id', 'upper-slider');
    expect(screen.getByText('RUB')).toBeInTheDocument();
    unmount();
    for (const nativeRef of [
      ref,
      lowerNativeInputRef,
      upperNativeInputRef,
      lowerNativeSliderRef,
      upperNativeSliderRef,
    ]) {
      expect(nativeRef.current).toBeNull();
    }
  });

  it('initializes from min/max and sends exactly two named canonical fields', () => {
    renderForm({ defaultValue: undefined, min: 10, max: 80 });
    expect(inputs().map((input) => input.value)).toEqual(['10', '80']);
    expect(data()).toEqual({ lower: '10', upper: '80' });
    for (const input of [...inputs(), ...sliders()]) expect(input).not.toHaveAttribute('name');
    expect(form().querySelectorAll('input[type=hidden]')).toHaveLength(2);
  });

  it.each(INPUT_SLIDER_RANGE_DIMENSIONS)('uses the %s input dimension with the matching slider', (dimension) => {
    renderForm({ dimension });
    expect(inputs()[0].parentElement).toHaveAttribute('data-dimension', dimension);
    expect(inputs()[1].parentElement).toHaveAttribute('data-dimension', dimension);
    expect(sliders()[0]).toHaveAttribute('type', 'range');
    expect(form().firstElementChild).not.toHaveAttribute('dimension');
  });

  it.each([0, 1] as const)('preserves invalid bound %s until blur, then clamps to its neighbor', (bound) => {
    const onValueChange = vi.fn();
    renderForm({ onValueChange });
    fireEvent.input(inputs()[bound], { target: { value: bound === 0 ? '90' : '10' } });
    expect(inputs()[bound]).toBeInvalid();
    expect(sliders()[bound]).toHaveValue(bound === 0 ? '25' : '75');
    expect(data()).toEqual(bound === 0 ? { lower: '', upper: '75' } : { lower: '25', upper: '' });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.blur(inputs()[bound]);
    expect(inputs()[bound]).toBeValid();
    expect(inputs()[bound].value).toBe(bound === 0 ? '74' : '26');
    expect(onValueChange).toHaveBeenCalledWith(bound === 0 ? ['74', '75'] : ['25', '26']);
  });

  it('clamps to absolute min/max when the other bound is empty', () => {
    renderForm({ defaultValue: ['', ''] });
    fireEvent.input(inputs()[0], { target: { value: '-10' } });
    fireEvent.blur(inputs()[0]);
    expect(inputs()[0]).toHaveValue('0');
    fireEvent.input(inputs()[1], { target: { value: '120' } });
    fireEvent.blur(inputs()[1]);
    expect(inputs()[1]).toHaveValue('100');
    expect(data()).toEqual({ lower: '0', upper: '100' });
  });

  it('normalizes before native blur callbacks and root bubbling', () => {
    const onBlur = vi.fn((event: FocusEvent<HTMLInputElement>) => expect(event.currentTarget.value).toBe('74'));
    const onRootBlur = vi.fn();
    renderForm({ lowerInputProps: { onBlur }, onBlur: onRootBlur });
    fireEvent.input(inputs()[0], { target: { value: '90' } });
    fireEvent.blur(inputs()[0]);
    expect(onBlur).toHaveBeenCalledOnce();
    expect(onRootBlur).toHaveBeenCalledOnce();
  });

  it('preserves empty bounds and last slider positions after blur', () => {
    const onValueChange = vi.fn();
    renderForm({ onValueChange });
    fireEvent.input(inputs()[0], { target: { value: '' } });
    fireEvent.blur(inputs()[0]);
    fireEvent.input(inputs()[1], { target: { value: '' } });
    fireEvent.blur(inputs()[1]);
    expect(inputs().map((input) => input.value)).toEqual(['', '']);
    expect(sliders().map((slider) => (slider as HTMLInputElement).value)).toEqual(['25', '75']);
    expect(data()).toEqual({ lower: '', upper: '' });
    expect(onValueChange.mock.calls).toEqual([[['', '75']], [['', '']]]);
  });

  it('keeps formatted text distinct from canonical strings, callbacks and FormData', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    const onInput = vi.fn();
    renderForm({
      max: 20000,
      step: 0.01,
      defaultValue: ['10000.5', '15000'],
      formatValue: (value) => value.toFixed(2).replace('.', ','),
      parseValue: (text) => Number(text.replaceAll(' ', '').replace(',', '.')),
      lowerInputProps: { onChange, onInput },
      onValueChange,
    });
    expect(inputs()[0]).toHaveValue('10000,50');
    fireEvent.input(inputs()[0], { target: { value: '12 000,25' } });
    expect(inputs()[0]).toHaveValue('12 000,25');
    expect(sliders()[0]).toHaveValue('12000.25');
    expect(data()).toEqual({ lower: '12000.25', upper: '15000' });
    fireEvent.change(sliders()[0], { target: { value: '13000' } });
    expect(inputs()[0]).toHaveValue('13000,00');
    expect(onValueChange.mock.calls).toEqual([[['12000.25', '15000']], [['13000', '15000']]]);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onInput).toHaveBeenCalledOnce();
  });

  it('does not round fractional text by step or overwrite the other bound when sliding', () => {
    renderForm({ defaultValue: ['20.26', '75.26'], step: 1 });
    fireEvent.change(sliders()[1], { target: { value: '80' } });
    expect(inputs()[0]).toHaveValue('20.26');
    expect(inputs()[1]).toHaveValue('80');
    fireEvent.blur(inputs()[0]);
    expect(data()).toEqual({ lower: '20.26', upper: '80' });
  });

  it('keeps the other field empty or unfinished while one slider changes', () => {
    renderForm();
    fireEvent.input(inputs()[0], { target: { value: '' } });
    fireEvent.change(sliders()[1], { target: { value: '80' } });
    expect(data()).toEqual({ lower: '', upper: '80' });
    fireEvent.input(inputs()[0], { target: { value: '-' } });
    fireEvent.change(sliders()[1], { target: { value: '90' } });
    expect(inputs()[0]).toHaveValue('-');
    expect(inputs()[0]).toBeInvalid();
    expect(inputs()[1]).toHaveValue('90');
  });

  it('keeps fractional neighboring values ordered when sliders round by step', () => {
    renderForm({ defaultValue: ['20.2', '30.8'] });
    fireEvent.change(sliders()[0], { target: { value: '31' } });
    expect(data()).toEqual({ lower: '29.8', upper: '30.8' });
    expect(form().checkValidity()).toBe(true);
    fireEvent.input(inputs()[1], { target: { value: '40' } });
    fireEvent.change(sliders()[1], { target: { value: '31' } });
    expect(form().checkValidity()).toBe(true);
  });

  it('does not submit an old canonical bound when changing its neighbor makes draft text valid', () => {
    renderForm();
    fireEvent.input(inputs()[0], { target: { value: '90' } });
    fireEvent.input(inputs()[1], { target: { value: '95' } });
    expect(inputs()[0]).toHaveValue('90');
    expect(inputs()[0]).toBeInvalid();
    expect(data()).toEqual({ lower: '', upper: '95' });
    fireEvent.blur(inputs()[0]);
    expect(inputs()[0]).toBeValid();
    expect(data()).toEqual({ lower: '90', upper: '95' });
  });

  it('updates native values and both validity states before notifying consumers', () => {
    renderForm({
      required: true,
      defaultValue: ['', ''],
      onValueChange: (value) => {
        expect(inputs()[0]).toHaveValue(value[0]);
        expect(inputs()[1]).toHaveValue(value[1]);
        expect(inputs()[0].validity.valueMissing).toBe(value[0] === '');
        expect(inputs()[1].validity.valueMissing).toBe(value[1] === '');
      },
    });
    fireEvent.change(sliders()[0], { target: { value: '20' } });
    fireEvent.change(sliders()[1], { target: { value: '80' } });
    expect(form().checkValidity()).toBe(true);
  });

  it('supports controlled editing and prioritizes external updates over draft text', () => {
    const Controlled = () => {
      const [value, setValue] = useState<InputSliderRangeValue>(['25', '75']);
      return (
        <>
          <InputSliderRange value={value} onValueChange={setValue} />
          <button onClick={() => setValue(['10', '90'])}>External</button>
        </>
      );
    };
    render(<Controlled />);
    fireEvent.input(inputs()[0], { target: { value: '30' } });
    expect(sliders()[0]).toHaveValue('30');
    fireEvent.input(inputs()[1], { target: { value: '-' } });
    fireEvent.click(screen.getByText('External'));
    expect(inputs().map((input) => input.value)).toEqual(['10', '90']);
    expect(inputs()[1]).toBeValid();
  });

  it('restores rejected controlled changes and native validity after callbacks', () => {
    const onValueChange = vi.fn();
    renderForm({ value: ['', '75'], required: true, onValueChange });
    fireEvent.input(inputs()[0], { target: { value: '30' } });
    expect(onValueChange).toHaveBeenCalledWith(['30', '75']);
    expect(inputs()[0]).toHaveValue('');
    expect(inputs()[0]).toBeInvalid();
    fireEvent.change(sliders()[1], { target: { value: '90' } });
    expect(inputs()[1]).toHaveValue('75');
  });

  it('preserves NaN text on blur and serializes it empty while blocking submit', () => {
    renderForm();
    fireEvent.input(inputs()[0], { target: { value: '-' } });
    fireEvent.blur(inputs()[0]);
    expect(inputs()[0]).toHaveValue('-');
    expect(form().checkValidity()).toBe(false);
    expect(data()).toEqual({ lower: '', upper: '75' });
  });

  it('validates external invalid or reversed canonical values instead of silently submitting them', () => {
    const { rerender } = render(
      <form data-testid="form">
        <InputSliderRange lowerName="lower" upperName="upper" value={['80', '20']} />
      </form>,
    );
    expect(inputs()[0]).toBeInvalid();
    expect(inputs()[1]).toBeInvalid();
    expect(data()).toEqual({ lower: '', upper: '' });
    rerender(
      <form data-testid="form">
        <InputSliderRange lowerName="lower" upperName="upper" value={['NaN', '20']} />
      </form>,
    );
    expect(inputs()[0]).toHaveValue('NaN');
    expect(data()).toEqual({ lower: '', upper: '20' });
  });

  it('honors FormItem context for both fields and sliders, including default overrides', () => {
    render(
      <FormItem dimension="s" required status="error">
        <InputSliderRange dimension="l" disabled readOnly defaultValue={['', '']} />
      </FormItem>,
    );
    expect(inputs()[0]).toBeRequired();
    expect(inputs()[1]).toBeRequired();
    for (const input of [...inputs(), ...sliders()]) expect(input).not.toBeDisabled();
    expect(sliders()).toHaveLength(2);
    expect(inputs()[0]).not.toHaveAttribute('readonly');
  });

  it('readOnly hides sliders and still submits both values', () => {
    renderForm({ readOnly: true });
    expect(screen.queryAllByRole('slider')).toHaveLength(0);
    expect(inputs()[0]).toHaveAttribute('readonly');
    expect(inputs()[1]).toHaveAttribute('readonly');
    expect(data()).toEqual({ lower: '25', upper: '75' });
  });

  it('disabled and disabled fieldsets exclude both fields from FormData', () => {
    const onValueChange = vi.fn();
    const { rerender } = renderForm({ disabled: true, onValueChange });
    expect(data()).toEqual({});
    for (const input of [...inputs(), ...sliders()]) expect(input).toBeDisabled();
    rerender(
      <form data-testid="form">
        <fieldset disabled>
          <InputSliderRange lowerName="lower" upperName="upper" onValueChange={onValueChange} />
        </fieldset>
      </form>,
    );
    fireEvent.input(inputs()[0], { target: { value: '30' } });
    fireEvent.change(sliders()[1], { target: { value: '80' } });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(data()).toEqual({});
  });

  it('associates all native inputs with an external form and resets uncontrolled values', async () => {
    const onValueChange = vi.fn();
    render(
      <>
        <form id="external" data-testid="form" />
        <InputSliderRange
          form="external"
          lowerName="lower"
          upperName="upper"
          defaultValue={['25', '75']}
          onValueChange={onValueChange}
        />
      </>,
    );
    fireEvent.input(inputs()[0], { target: { value: '30' } });
    fireEvent.input(inputs()[1], { target: { value: '-' } });
    expect(form().checkValidity()).toBe(false);
    for (const input of [...inputs(), ...sliders()]) expect(input).toHaveAttribute('form', 'external');
    form().reset();
    await waitFor(() => expect(inputs()[0]).toHaveValue('25'));
    expect(inputs()[1]).toHaveValue('75');
    expect(form().checkValidity()).toBe(true);
    expect(data()).toEqual({ lower: '25', upper: '75' });
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it('clears controlled drafts on native reset without changing the controlled pair', async () => {
    renderForm({ value: ['25', '75'] });
    fireEvent.input(inputs()[1], { target: { value: '-' } });
    form().reset();
    await waitFor(() => expect(inputs()[1]).toHaveValue('75'));
    expect(data()).toEqual({ lower: '25', upper: '75' });
  });

  it('honors canceled form reset', async () => {
    render(
      <form data-testid="form" onReset={(event) => event.preventDefault()}>
        <InputSliderRange defaultValue={['25', '75']} />
      </form>,
    );
    fireEvent.input(inputs()[0], { target: { value: '30' } });
    form().reset();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(inputs()[0]).toHaveValue('30');
  });
});
