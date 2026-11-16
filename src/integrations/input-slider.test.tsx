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

const amountInput = () => screen.getByRole('textbox', { name: 'Сумма' }) as HTMLInputElement;
const nativeValues = () => new FormData(amountInput().form!);
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
] as const)('%s InputSlider', (_, Template) => {
  it('submits the unformatted string through both the form library and FormData', async () => {
    render(<Template />);
    fillRequiredFields();
    fireEvent.input(amountInput(), { target: { value: '12 345,67' } });
    fireEvent.blur(amountInput());
    fireEvent.submit(amountInput().form!);
    await waitFor(() =>
      expect(JSON.parse(screen.getByText(/"amount"/).textContent!)).toMatchObject({ amount: '12345.67' }),
    );
    expect(nativeValues().getAll('amount')).toEqual(['12345.67']);
    expect(amountInput()).not.toHaveAttribute('name');
    expect(screen.getByRole('slider', { name: 'Сумма' })).not.toHaveAttribute('name');
  });

  it('blocks stale submission for invalid draft and revalidates when the same canonical value is restored', async () => {
    render(<Template />);
    fillRequiredFields();
    fireEvent.input(amountInput(), { target: { value: '-' } });
    fireEvent.blur(amountInput());
    await screen.findByText('Введите число.');
    fireEvent.submit(amountInput().form!);
    await waitFor(() => expect(amountInput()).toHaveFocus());
    expect(screen.queryByText(/"amount"/)).not.toBeInTheDocument();
    expect(nativeValues().get('amount')).toBe('');
    fireEvent.input(amountInput(), { target: { value: '10 000,50' } });
    await waitFor(() => expect(screen.queryByText('Введите число.')).not.toBeInTheDocument());
    fireEvent.submit(amountInput().form!);
    await waitFor(() =>
      expect(JSON.parse(screen.getByText(/"amount"/).textContent!)).toMatchObject({ amount: '10000.5' }),
    );
  });

  it('clears invalid draft on library reset even when canonical value equals the default', async () => {
    render(<Template />);
    fireEvent.input(amountInput(), { target: { value: '-' } });
    await screen.findByText('Введите число.');
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }));
    await waitFor(() => expect(amountInput().value.replace(/\s/g, ' ')).toBe('10 000,50'));
    expect(amountInput()).toBeValid();
    expect(nativeValues().get('amount')).toBe('10000.5');
    expect(screen.queryByText('Введите число.')).not.toBeInTheDocument();
  });

  it('validates clearing and immediately recovers when Slider supplies a new value', async () => {
    render(<Template />);
    fillRequiredFields();
    fireEvent.click(within(amountInput().parentElement!).getByRole('button', { name: 'Очистить поле' }));
    await screen.findByText('Введите сумму');
    fireEvent.submit(amountInput().form!);
    await waitFor(() => expect(amountInput()).toHaveFocus());
    expect(screen.queryByText(/"amount"/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider', { name: 'Сумма' }), { target: { value: '12000' } });
    await waitFor(() => expect(screen.queryByText('Введите сумму')).not.toBeInTheDocument());
    fireEvent.submit(amountInput().form!);
    await waitFor(() =>
      expect(JSON.parse(screen.getByText(/"amount"/).textContent!)).toMatchObject({ amount: '12000' }),
    );
  });

  it('clears the library error after blur clamps back to the same canonical maximum', async () => {
    render(<Template />);
    fillRequiredFields();
    fireEvent.change(screen.getByRole('slider', { name: 'Сумма' }), { target: { value: '20000' } });
    fireEvent.input(amountInput(), { target: { value: '30000' } });
    await screen.findByText('Введите число от 0 до 20000.');
    fireEvent.blur(amountInput());
    await waitFor(() => expect(screen.queryByText('Введите число от 0 до 20000.')).not.toBeInTheDocument());
    expect(amountInput().value.replace(/\s/g, ' ')).toBe('20 000,00');
    expect(nativeValues().get('amount')).toBe('20000');
    fireEvent.submit(amountInput().form!);
    await waitFor(() =>
      expect(JSON.parse(screen.getByText(/"amount"/).textContent!)).toMatchObject({ amount: '20000' }),
    );
  });
});
