import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ReactHookFormTemplate } from './react-hook-form/ReactHookForm.template';
import { ReactHookFormWithFormItemTemplate } from './react-hook-form/ReactHookFormWithFormItem.template';
import { TanStackFormTemplate } from './tanstack-form/TanStackForm.template';
import { TanStackFormWithFormItemTemplate } from './tanstack-form/TanStackFormWithFormItem.template';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const fromInput = () => screen.getByRole('textbox', { name: 'Сумма от' }) as HTMLInputElement;
const toInput = () => screen.getByRole('textbox', { name: 'Сумма до' }) as HTMLInputElement;
const form = () => fromInput().form!;
const nativeValues = () => Object.fromEntries(new FormData(form()));
const submittedValues = () => JSON.parse(screen.getByText(/"amountFrom"/).textContent!);
const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText('Имя', { exact: true }), { target: { value: 'Иван' } });
  fireEvent.change(screen.getByLabelText('Пароль', { exact: true }), { target: { value: 'password1' } });
  fireEvent.change(screen.getByLabelText('Повторите пароль', { exact: true }), { target: { value: 'password1' } });
  fireEvent.change(screen.getByLabelText('Электронная почта', { exact: true }), {
    target: { value: 'ivan@example.com' },
  });
  fireEvent.click(screen.getByRole('checkbox', { name: 'Я принимаю условия использования' }));
};

describe.each([
  ['RHF', ReactHookFormTemplate],
  ['RHF + FormItem', ReactHookFormWithFormItemTemplate],
  ['TanStack', TanStackFormTemplate],
  ['TanStack + FormItem', TanStackFormWithFormItemTemplate],
] as const)('%s InputSliderRange', (_, Template) => {
  it('submits two independent unformatted strings through the library and native form', async () => {
    render(<Template />);
    fillRequiredFields();
    fireEvent.input(fromInput(), { target: { value: '12 345,67' } });
    fireEvent.input(toInput(), { target: { value: '16 789,01' } });
    fireEvent.blur(toInput());
    fireEvent.submit(form());
    await waitFor(() => expect(submittedValues()).toMatchObject({ amountFrom: '12345.67', amountTo: '16789.01' }));
    expect(nativeValues()).toMatchObject({ amountFrom: '12345.67', amountTo: '16789.01' });
    expect(new FormData(form()).getAll('amountFrom')).toEqual(['12345.67']);
    expect(new FormData(form()).getAll('amountTo')).toEqual(['16789.01']);
    for (const input of [
      fromInput(),
      toInput(),
      screen.getByRole('slider', { name: 'Сумма от' }),
      screen.getByRole('slider', { name: 'Сумма до' }),
    ]) {
      expect(input).not.toHaveAttribute('name');
    }
  });

  it.each(['from', 'to'] as const)(
    'blocks an invalid %s draft, focuses that bound and recovers with unchanged canonical value',
    async (bound) => {
      render(<Template />);
      fillRequiredFields();
      const input = bound === 'from' ? fromInput : toInput;
      fireEvent.input(input(), { target: { value: '-' } });
      fireEvent.blur(input());
      await screen.findByText('Введите число.');
      fireEvent.submit(form());
      await waitFor(() => expect(input()).toHaveFocus());
      expect(screen.queryByText(/"amountFrom"/)).not.toBeInTheDocument();
      expect(nativeValues()[bound === 'from' ? 'amountFrom' : 'amountTo']).toBe('');
      fireEvent.input(input(), { target: { value: bound === 'from' ? '10 000,50' : '15 000,00' } });
      await waitFor(() => expect(screen.queryByText('Введите число.')).not.toBeInTheDocument());
      fireEvent.submit(form());
      await waitFor(() => expect(submittedValues()).toMatchObject({ amountFrom: '10000.5', amountTo: '15000' }));
    },
  );

  it('clears both invalid drafts and library errors on reset', async () => {
    render(<Template />);
    fireEvent.input(fromInput(), { target: { value: '-' } });
    fireEvent.input(toInput(), { target: { value: '-' } });
    await screen.findByText(/^Введите число\./);
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }));
    await waitFor(() => expect(fromInput().value.replace(/\s/g, ' ')).toBe('10 000,50'));
    expect(toInput().value.replace(/\s/g, ' ')).toBe('15 000,00');
    expect(fromInput()).toBeValid();
    expect(toInput()).toBeValid();
    expect(nativeValues()).toMatchObject({ amountFrom: '10000.5', amountTo: '15000' });
    expect(screen.queryByText(/Введите число\./)).not.toBeInTheDocument();
  });

  it('revalidates blur normalization back to the same minimum gap', async () => {
    render(<Template />);
    fillRequiredFields();
    fireEvent.input(fromInput(), { target: { value: '14 999,99' } });
    fireEvent.input(fromInput(), { target: { value: '20000' } });
    expect(fromInput()).toBeInvalid();
    fireEvent.blur(fromInput());
    await waitFor(() => expect(fromInput()).toBeValid());
    expect(fromInput().value.replace(/\s/g, ' ')).toBe('14 999,99');
    fireEvent.submit(form());
    await waitFor(() => expect(submittedValues()).toMatchObject({ amountFrom: '14999.99', amountTo: '15000' }));
  });

  it('requires each bound and clears the error after keyboard-style slider selection', async () => {
    render(<Template />);
    fillRequiredFields();
    fireEvent.click(within(toInput().parentElement!).getByRole('button', { name: 'Очистить поле' }));
    await screen.findByText('Введите верхнюю сумму');
    fireEvent.submit(form());
    await waitFor(() => expect(toInput()).toHaveFocus());
    fireEvent.change(screen.getByRole('slider', { name: 'Сумма до' }), { target: { value: '16000' } });
    await waitFor(() => expect(screen.queryByText('Введите верхнюю сумму')).not.toBeInTheDocument());
    fireEvent.submit(form());
    await waitFor(() => expect(submittedValues()).toMatchObject({ amountFrom: '10000.5', amountTo: '16000' }));
  });
});
