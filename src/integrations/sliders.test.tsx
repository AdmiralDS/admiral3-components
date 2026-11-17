import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ReactHookFormTemplate } from './react-hook-form/ReactHookForm.template';
import { TanStackFormTemplate } from './tanstack-form/TanStackForm.template';

// Размеры TextArea в этих формах проверяются отдельно в браузере.
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

describe.each([
  ['React Hook Form', ReactHookFormTemplate],
  ['TanStack Form', TanStackFormTemplate],
] as const)('%s sliders', (_, Template) => {
  it('submits numeric slider values and resets all three native inputs', async () => {
    render(<Template />);
    const age = screen.getByRole('slider', { name: 'Возраст' });
    const lower = screen.getByRole('slider', { name: 'Минимальный бюджет' });
    const upper = screen.getByRole('slider', { name: 'Максимальный бюджет' });
    fireEvent.change(age, { target: { value: '35' } });
    fireEvent.change(lower, { target: { value: '40' } });
    fireEvent.change(upper, { target: { value: '90' } });
    expect(age).toHaveValue('35');
    expect(lower).toHaveValue('40');
    expect(upper).toHaveValue('90');
    fireEvent.change(screen.getByLabelText('Имя', { exact: true }), { target: { value: 'Иван' } });
    fireEvent.change(screen.getByLabelText('Пароль', { exact: true }), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText('Повторите пароль', { exact: true }), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText('Электронная почта', { exact: true }), {
      target: { value: 'ivan@example.com' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Я принимаю условия использования' }));
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
    await waitFor(() => {
      expect(JSON.parse(screen.getByText(/"budget"/).textContent ?? '')).toMatchObject({
        age: 35,
        budget: [40, 90],
      });
    });
    const nativeValues = new FormData(age.closest('form')!);
    expect(nativeValues.get('age')).toBe('35');
    expect(nativeValues.get('budget.0')).toBe('40');
    expect(nativeValues.get('budget.1')).toBe('90');
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }));
    await waitFor(() => {
      expect(age).toHaveValue('30');
      expect(lower).toHaveValue('25');
      expect(upper).toHaveValue('75');
      expect(screen.queryByText(/"budget"/)).not.toBeInTheDocument();
    });
  });
});
