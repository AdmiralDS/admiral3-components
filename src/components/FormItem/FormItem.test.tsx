import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormItem } from './FormItem';
import { Input } from '../Input';

describe('FormItem', () => {
  it('renders the error in the description and connects the label explicitly', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(
      <FormItem label="Email" htmlFor="email-field" status="error" description="Invalid address" required>
        <Input ref={inputRef} id="email-field" name="email" status="error" />
      </FormItem>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(inputRef.current).toBe(input);
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-field');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('id', 'email-field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid address')).toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(screen.getByText('Invalid address').closest('[data-status]')).toHaveAttribute('data-status', 'error');
  });

  it('shows a success message in the same description slot', () => {
    render(
      <FormItem label="Email" status="success" description="Address confirmed">
        <Input status="success" />
      </FormItem>,
    );

    expect(screen.getByText('Address confirmed').closest('[data-status]')).toHaveAttribute('data-status', 'success');
  });

  it('preserves the input id and existing description', () => {
    render(
      <>
        <span id="external-hint">External hint</span>
        <FormItem label="Name" htmlFor="name-field" description="Your name">
          <Input id="name-field" aria-describedby="external-hint" />
        </FormItem>
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('id', 'name-field');
    expect(input).toHaveAttribute('aria-describedby', 'external-hint');
    expect(screen.getByText('Your name').closest('[data-dimension]')).not.toHaveAttribute('data-status');
  });

  it('places the counter outside the control next to the description', () => {
    const { container } = render(
      <FormItem label="Name" htmlFor="counter-field" description="Short name" counter="16 / 20">
        <Input id="counter-field" maxLength={20} />
      </FormItem>,
    );

    const input = container.querySelector<HTMLInputElement>('#counter-field');
    expect(input).toBeInTheDocument();
    const counter = screen.getByText('16 / 20');
    expect(input).toHaveAttribute('maxlength', '20');
    expect(input).not.toContainElement(counter);
    expect(counter.parentElement).toContainElement(screen.getByText('Short name'));
    expect(container.querySelector<HTMLLabelElement>('label')).not.toContainElement(input);
  });

  it('skips empty optional slots and preserves zero', () => {
    const { container, rerender } = render(
      <FormItem label="Name" additionalLabel={true} description={true} counter={true}>
        <input />
      </FormItem>,
    );

    expect(container.querySelectorAll('span')).toHaveLength(0);

    rerender(
      <FormItem label="Name" additionalLabel={0} description={0} counter={0}>
        <input />
      </FormItem>,
    );

    expect(Array.from(container.querySelectorAll('span'), (span) => span.textContent)).toEqual(['0', '0', '0']);
  });

  it('places the additional label beside the field label without changing its accessible name', () => {
    const { container } = render(
      <FormItem label="Name" additionalLabel="Optional" htmlFor="additional-label-field">
        <Input id="additional-label-field" />
      </FormItem>,
    );

    const input = container.querySelector<HTMLInputElement>('#additional-label-field');
    const label = container.querySelector<HTMLLabelElement>('label');
    const additionalLabel = container.querySelector<HTMLSpanElement>('label + span');
    expect(label).not.toBeNull();
    expect(additionalLabel).not.toBeNull();
    if (!label || !additionalLabel) return;
    expect(label).toHaveAttribute('for', 'additional-label-field');
    expect(label.parentElement).toContainElement(additionalLabel);
    expect(label).not.toContainElement(additionalLabel);
    expect(input).toHaveAccessibleName('Name');
  });

  it('uses m by default and accepts xs for a matching input', () => {
    const { container, rerender } = render(
      <FormItem label="Name">
        <Input dimension="m" />
      </FormItem>,
    );
    expect(container.querySelector('label')?.parentElement?.parentElement).toHaveAttribute('data-dimension', 'm');

    rerender(
      <FormItem label="Name" dimension="xs">
        <Input dimension="xs" />
      </FormItem>,
    );
    expect(container.querySelector('label')?.parentElement?.parentElement).toHaveAttribute('data-dimension', 'xs');
  });
});
