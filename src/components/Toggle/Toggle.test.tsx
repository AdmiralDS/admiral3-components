import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TOGGLE_ROOT_DATA_ATTRIBUTE } from './constants';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  afterEach(cleanup);

  it('renders an accessible switch with a label', () => {
    render(<Toggle>Notifications</Toggle>);

    expect(screen.getByRole('switch', { name: 'Notifications' })).not.toBeChecked();
    expect(screen.getByText('Notifications').closest('label')).toHaveAttribute(TOGGLE_ROOT_DATA_ATTRIBUTE, 'true');
  });

  it('forwards input attributes and ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Toggle ref={ref} name="notifications" defaultChecked />);

    expect(ref.current).toBe(screen.getByRole('switch'));
    expect(ref.current).toHaveAttribute('name', 'notifications');
    expect(ref.current).toBeChecked();
  });

  it('supports all dimensions, left label and extra text', () => {
    render(
      <Toggle dimension="xs" labelPosition="left" extraText="Used for important updates">
        Notifications
      </Toggle>,
    );

    expect(screen.getByText('Notifications').closest('label')).toHaveAttribute('data-dimension', 'xs');
    expect(screen.getByText('Used for important updates')).toBeVisible();
  });

  it('applies fixed width independently of label position', () => {
    const { rerender } = render(
      <Toggle labelPosition="left" width={192}>
        Notifications
      </Toggle>,
    );

    expect(screen.getByText('Notifications').closest('label')).toHaveStyle({ width: '192px' });

    rerender(<Toggle width={192}>Notifications</Toggle>);

    expect(screen.getByText('Notifications').closest('label')).toHaveStyle({ width: '192px' });
  });

  it('does not change or emit change when readOnly', () => {
    const onChange = vi.fn();
    render(
      <Toggle readOnly onChange={onChange}>
        Notifications
      </Toggle>,
    );

    fireEvent.click(screen.getByRole('switch'));

    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('is excluded from interaction when disabled', () => {
    render(<Toggle disabled>Notifications</Toggle>);

    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
