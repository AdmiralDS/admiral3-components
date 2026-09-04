import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { InputIconButton } from './InputIconButton';

describe('InputIconButton', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not prevent input focus by default and calls onPointerDown', () => {
    const onPointerDown = vi.fn();

    render(<InputIconButton aria-label="Действие" onPointerDown={onPointerDown} />);

    const button = screen.getByRole('button', { name: 'Действие' });
    fireEvent.pointerDown(button);

    expect(button).toHaveAttribute('data-input-icon-button');
    expect(button).not.toHaveAttribute('data-prevent-input-focus');
    expect(onPointerDown).toHaveBeenCalledOnce();
  });

  it('marks the button when input focus is prevented', () => {
    render(<InputIconButton aria-label="Действие" preventFocus />);

    const button = screen.getByRole('button', { name: 'Действие' });

    expect(button).toHaveAttribute('data-prevent-input-focus');
  });

  it('forwards button props and ref', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<InputIconButton ref={ref} aria-label="Действие" disabled />);

    const button = screen.getByRole('button', { name: 'Действие' });
    expect(ref.current).toBe(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveAttribute('preventFocus');
  });
});
