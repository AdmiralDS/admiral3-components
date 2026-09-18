import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReactHookFormTemplate } from './react-hook-form/ReactHookForm.template';
import { TanStackFormTemplate } from './tanstack-form/TanStackForm.template';

afterEach(cleanup);

describe.each([
  ['React Hook Form', ReactHookFormTemplate],
  ['TanStack Form', TanStackFormTemplate],
] as const)('%s password confirmation', (_, Template) => {
  it.each([false, true])('updates messages and resets both fields withFormItem=%s', async (withFormItem) => {
    render(<Template withFormItem={withFormItem} />);
    const password = screen.getByLabelText('Пароль', { exact: true });
    const confirmation = screen.getByLabelText('Повторите пароль', { exact: true });
    expect(password).not.toHaveAttribute('aria-describedby');
    expect(confirmation).not.toHaveAttribute('aria-describedby');

    fireEvent.change(password, { target: { value: 'password1' } });
    await waitFor(() => expect(password).toHaveAccessibleDescription('Пароль соответствует требованиям'));
    expect(confirmation).not.toHaveAttribute('aria-describedby');

    fireEvent.change(confirmation, { target: { value: 'different' } });
    await waitFor(() => expect(confirmation).toHaveAccessibleDescription('Пароли не совпадают'));
    expect(confirmation).toHaveAttribute('aria-invalid', 'true');

    fireEvent.change(confirmation, { target: { value: 'password1' } });
    await waitFor(() => expect(confirmation).toHaveAccessibleDescription('Пароли совпадают'));
    expect(confirmation.closest('[data-status]')).toHaveAttribute('data-status', 'success');

    fireEvent.change(password, { target: { value: 'password2' } });
    await waitFor(() => expect(confirmation).toHaveAccessibleDescription('Пароли не совпадают'));
    expect(confirmation.closest('[data-status]')).toHaveAttribute('data-status', 'error');

    fireEvent.change(password, { target: { value: 'password1' } });
    await waitFor(() => expect(confirmation).toHaveAccessibleDescription('Пароли совпадают'));

    fireEvent.change(password, { target: { value: 'short' } });
    fireEvent.change(confirmation, { target: { value: 'short' } });
    await waitFor(() => expect(password).toHaveAccessibleDescription('Пароль должен содержать не менее 8 символов'));
    await waitFor(() => expect(confirmation).not.toHaveAttribute('aria-describedby'));
    expect(screen.queryByText('Пароли совпадают')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }));
    await waitFor(() => {
      expect(password).toHaveValue('');
      expect(confirmation).toHaveValue('');
      expect(password).not.toHaveAttribute('aria-describedby');
      expect(confirmation).not.toHaveAttribute('aria-describedby');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
    await waitFor(() => expect(confirmation).toHaveAccessibleDescription('Повторите пароль'));
  });
});
