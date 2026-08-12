import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RADIO_BUTTON_DIMENSIONS } from './constants';
import { RadioButton } from './RadioButton';

describe('RadioButton', () => {
  afterEach(cleanup);

  it('renders a native radio with label and extra text', () => {
    render(
      <RadioButton name="answer" value="yes" extraText="Additional information">
        Yes
      </RadioButton>,
    );

    const input = screen.getByRole('radio', { name: /yes/i });
    expect(input).toHaveAttribute('name', 'answer');
    expect(input).toHaveAttribute('value', 'yes');
    expect(input.closest('label')).not.toBeNull();
    expect(screen.getByText('Additional information')).toBeInTheDocument();
  });

  it('forwards ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<RadioButton ref={ref}>Radio</RadioButton>);

    expect(ref.current).toBe(screen.getByRole('radio'));
  });

  it('passes className to the root label', () => {
    render(<RadioButton className="custom-radio">Radio</RadioButton>);

    expect(screen.getByRole('radio').closest('label')).toHaveClass('custom-radio');
  });

  it.each(RADIO_BUTTON_DIMENSIONS)('sets %s dimension data-attribute', (dimension) => {
    render(<RadioButton dimension={dimension}>Radio</RadioButton>);

    expect(screen.getByRole('radio').closest('label')).toHaveAttribute('data-dimension', dimension);
  });

  it('supports checked and disabled native states', () => {
    render(
      <RadioButton checked disabled onChange={() => undefined}>
        Radio
      </RadioButton>,
    );

    expect(screen.getByRole('radio')).toBeChecked();
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('marks the native radio as invalid in the error state', () => {
    render(<RadioButton error>Radio</RadioButton>);

    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('emits click and change when activated', () => {
    const onChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) => event.currentTarget.checked);
    const onClick = vi.fn();
    render(
      <RadioButton onChange={onChange} onClick={onClick}>
        Radio
      </RadioButton>,
    );

    const radio = screen.getByRole('radio');
    fireEvent.click(radio);

    expect(radio).toBeChecked();
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0]).toHaveProperty('defaultPrevented', false);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.results[0].value).toBe(true);
  });

  it('prevents activation click and does not emit change when readOnly', () => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    render(
      <RadioButton readOnly onChange={onChange} onClick={onClick}>
        Radio
      </RadioButton>,
    );

    const radio = screen.getByRole('radio');
    const eventResult = fireEvent.click(radio);

    expect(eventResult).toBe(false);
    expect(radio).not.toBeChecked();
    expect(radio).toHaveAttribute('aria-readonly', 'true');
    expect(onChange).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0]).toHaveProperty('defaultPrevented', true);
  });

  it('inherits native disabled state from fieldset', () => {
    render(
      <fieldset disabled>
        <RadioButton>Radio</RadioButton>
      </fieldset>,
    );

    expect(screen.getByRole('radio')).toBeDisabled();
  });
});
