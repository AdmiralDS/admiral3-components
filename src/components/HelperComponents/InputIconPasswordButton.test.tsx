import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { InputIconPasswordButton } from './InputIconPasswordButton';

describe('InputIconPasswordButton', () => {
  afterEach(cleanup);

  it('requests showing a hidden password', () => {
    const onVisibleChange = vi.fn();

    render(<InputIconPasswordButton visible={false} onVisibleChange={onVisibleChange} />);

    const button = screen.getByRole('button', { name: 'Показать пароль' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-prevent-input-focus');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(onVisibleChange).toHaveBeenCalledWith(true);
  });

  it('supports custom labels and requests hiding a visible password', () => {
    const onVisibleChange = vi.fn();

    render(
      <InputIconPasswordButton
        visible
        onVisibleChange={onVisibleChange}
        showPasswordAriaLabel="Show password"
        hidePasswordAriaLabel="Hide password"
      />,
    );

    const button = screen.getByRole('button', { name: 'Hide password' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(onVisibleChange).toHaveBeenCalledWith(false);
  });

  it('forwards button props and ref', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <InputIconPasswordButton
        ref={ref}
        visible={false}
        onVisibleChange={vi.fn()}
        data-testid="visibility-button"
        disabled
      />,
    );

    const button = screen.getByTestId('visibility-button');
    expect(ref.current).toBe(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('allows overriding content, aria attributes and focus behavior', () => {
    render(
      <InputIconPasswordButton
        visible={false}
        onVisibleChange={vi.fn()}
        aria-label="Custom action"
        aria-pressed="mixed"
        preventFocus
      >
        Custom icon
      </InputIconPasswordButton>,
    );

    const button = screen.getByRole('button', { name: 'Custom action' });
    expect(button).toHaveTextContent('Custom icon');
    expect(button).toHaveAttribute('aria-pressed', 'mixed');
    expect(button).toHaveAttribute('data-prevent-input-focus');
  });

  it('calls onClick and allows it to cancel visibility change', () => {
    const onVisibleChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());

    render(<InputIconPasswordButton visible={false} onVisibleChange={onVisibleChange} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Показать пароль' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onVisibleChange).not.toHaveBeenCalled();
  });
});
