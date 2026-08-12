import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CheckBox } from './CheckBox';
import { CHECK_BOX_DIMENSIONS } from './constants';

describe('CheckBox', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a native checkbox with a label', () => {
    render(<CheckBox>Согласен</CheckBox>);

    const input = screen.getByRole('checkbox', { name: 'Согласен' });

    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).not.toHaveAttribute('data-read-only');
  });

  it('uses m as the default dimension and supports every dimension', () => {
    const { rerender } = render(<CheckBox>CheckBox</CheckBox>);
    const root = screen.getByText('CheckBox').closest('label');

    expect(root).toHaveAttribute('data-dimension', 'm');

    CHECK_BOX_DIMENSIONS.forEach((dimension) => {
      rerender(<CheckBox dimension={dimension}>CheckBox</CheckBox>);
      expect(root).toHaveAttribute('data-dimension', dimension);
    });
  });

  it('renders additional text under the label', () => {
    render(<CheckBox extraText="Дополнительный текст">CheckBox</CheckBox>);

    const input = screen.getByRole('checkbox', { name: /CheckBox.*Дополнительный текст/ });

    expect(input).not.toHaveAttribute('aria-labelledby');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('renders non-null ReactNode labels and hints', () => {
    const { rerender } = render(<CheckBox>{0}</CheckBox>);

    expect(screen.getByRole('checkbox', { name: '0' })).toBeInTheDocument();

    rerender(<CheckBox extraText={0}>CheckBox</CheckBox>);
    expect(screen.getByRole('checkbox', { name: /CheckBox.*0/ })).toBeInTheDocument();
  });

  it('keeps the component height without rendering a label when children are omitted', () => {
    render(<CheckBox aria-label="Option" />);

    const input = screen.getByRole('checkbox', { name: 'Option' });
    const root = input.parentElement;

    expect(root).not.toBeNull();
    expect(root?.querySelector('div')).not.toBeInTheDocument();
    expect(input.nextElementSibling).toHaveStyle({ width: '20px', height: '20px', marginBlock: '2px' });
    expect(input).toHaveStyle({ width: '100%', height: '100%' });
  });

  it('forwards input attributes and ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<CheckBox ref={ref} name="option" value="yes" aria-label="Option" />);

    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Option' }));
    expect(ref.current).toHaveAttribute('name', 'option');
    expect(ref.current).toHaveAttribute('value', 'yes');
  });

  it('applies className and style to the root element', () => {
    render(<CheckBox className="custom-checkbox" style={{ marginTop: 8 }} aria-label="Option" />);

    const input = screen.getByRole('checkbox', { name: 'Option' });
    const root = input.parentElement;

    expect(root).toHaveClass('custom-checkbox');
    expect(root).toHaveStyle({ marginTop: '8px' });
    expect(input).not.toHaveClass('custom-checkbox');
    expect(input).not.toHaveAttribute('style');
  });

  it('inherits dimension from a fieldset', () => {
    render(
      <fieldset data-dimension="xs">
        <CheckBox>Option</CheckBox>
      </fieldset>,
    );

    const input = screen.getByRole('checkbox', { name: 'Option' });
    const control = input.nextElementSibling;

    expect(input.parentElement).toHaveStyle({ gap: '8px' });
    expect(control).toHaveStyle({ width: '14px', height: '14px', marginBlock: '1px' });
  });

  it('supports checked and indeterminate states', () => {
    const { container, rerender } = render(<CheckBox checked readOnly aria-label="Option" />);
    const input = screen.getByRole('checkbox', { name: 'Option' });

    expect(input).toBeChecked();
    expect(container.querySelector('[data-icon="success"]')).toBeInTheDocument();

    rerender(<CheckBox indeterminate aria-label="Option" />);
    expect(input).toHaveProperty('indeterminate', true);
    expect(input).toHaveAttribute('aria-checked', 'mixed');
    expect(container.querySelector('[data-icon="minus"]')).toBeInTheDocument();
  });

  it('keeps the native indeterminate state while the prop remains true', () => {
    const { rerender } = render(<CheckBox indeterminate aria-label="Option" />);
    const input = screen.getByRole('checkbox', { name: 'Option' });

    fireEvent.click(input);
    expect(input).toHaveProperty('indeterminate', true);

    rerender(<CheckBox indeterminate aria-label="Option" />);
    expect(input).toHaveProperty('indeterminate', true);
  });

  it('does not reference additional text when the label is omitted', () => {
    render(<CheckBox extraText="Дополнительный текст" aria-label="Option" />);

    const input = screen.getByRole('checkbox', { name: 'Option' });

    expect(input).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByText('Дополнительный текст')).not.toBeInTheDocument();
  });

  it('inherits the disabled presentation from a fieldset', () => {
    render(
      <fieldset disabled>
        <CheckBox extraText="Дополнительный текст">Option</CheckBox>
      </fieldset>,
    );

    const input = screen.getByRole('checkbox', { name: /Option.*Дополнительный текст/ });
    const root = input.parentElement;

    expect(input).toBeDisabled();
    expect(root).toHaveStyle({ cursor: 'not-allowed' });
    expect(screen.getByText('Option').parentElement).toHaveStyle({
      color: 'var(--admiral-color-neutral-text-disable-rest, rgba(0, 0, 0, 0.26))',
    });
    expect(screen.getByText('Дополнительный текст')).toHaveStyle({
      color: 'var(--admiral-color-neutral-text-disable-rest, rgba(0, 0, 0, 0.26))',
    });
  });

  it('prevents changing a readOnly checkbox', () => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(<CheckBox readOnly onChange={onChange} onClick={onClick} onKeyDown={onKeyDown} aria-label="Option" />);
    const input = screen.getByRole('checkbox', { name: 'Option' });

    fireEvent.click(input);
    fireEvent.keyDown(input, { key: ' ' });

    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute('aria-readonly', 'true');
    expect(input).toHaveAttribute('data-read-only', '');
    expect(onChange).not.toHaveBeenCalled();
    expect(onClick.mock.calls[0][0].isDefaultPrevented()).toBe(true);
    expect(onKeyDown.mock.calls[0][0].isDefaultPrevented()).toBe(false);

    input.focus();
    expect(input).toHaveFocus();
  });

  it('includes a checked readOnly checkbox in form data', () => {
    const { container } = render(
      <form>
        <CheckBox name="option" value="yes" defaultChecked readOnly aria-label="Option" />
        <CheckBox name="disabled-option" value="no" defaultChecked disabled aria-label="Disabled option" />
      </form>,
    );
    const form = container.querySelector('form');

    expect(form).not.toBeNull();
    expect(Object.fromEntries(new FormData(form!))).toEqual({ option: 'yes' });
  });

  it('marks error state as invalid', () => {
    render(<CheckBox error aria-label="Option" />);

    expect(screen.getByRole('checkbox', { name: 'Option' })).toHaveAttribute('aria-invalid', 'true');
  });
});
