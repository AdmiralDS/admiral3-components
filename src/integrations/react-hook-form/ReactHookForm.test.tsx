import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Controller, useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';

import { FormItem, Input } from '@admiral-ds/admiral3-components';

afterEach(cleanup);

describe('React Hook Form integration', () => {
  it('keeps the counter synchronized after setValue and reset when Input uses Controller', async () => {
    const Form = () => {
      const { control, reset, setValue } = useForm({ defaultValues: { name: '12' } });

      return (
        <form>
          <FormItem label="Name" htmlFor="name" maxLength={5} counterThreshold={0}>
            <Controller name="name" control={control} render={({ field }) => <Input {...field} id="name" />} />
          </FormItem>
          <button type="button" onClick={() => setValue('name', '1234')}>
            Set value
          </button>
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
        </form>
      );
    };

    render(<Form />);

    expect(screen.getByLabelText('Name')).toHaveValue('12');
    expect(screen.getByText('2 / 5')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Set value' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('1234');
      expect(screen.getByText('4 / 5')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('12');
      expect(screen.getByText('2 / 5')).toBeInTheDocument();
    });
  });
});
