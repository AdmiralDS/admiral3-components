import { createRef } from 'react';

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RemovableChip } from './RemovableChip';

describe('RemovableChip', () => {
  afterEach(cleanup);

  it('forwards its root ref and keeps the close button out of the Tab order', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RemovableChip ref={ref} onClose={vi.fn()} data-testid="chip" closeButtonProps={{ 'aria-label': 'Удалить Марс' }}>
        Марс
      </RemovableChip>,
    );
    const chip = screen.getByTestId('chip');
    const close = within(chip).getByRole('button', { name: 'Удалить Марс' });

    expect(ref.current).toBe(chip);
    expect(chip).toHaveAttribute('role', 'button');
    expect(chip).toHaveAttribute('tabindex', '0');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(close).toHaveAttribute('type', 'button');
    expect(close).toHaveAttribute('tabindex', '-1');
    expect(close.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(chip).toHaveAttribute('data-dimension', 'm');
    expect(chip).toHaveAttribute('data-appearance', 'outlined');
    expect(chip).toHaveAttribute('data-color-mode', 'colored');
  });

  it('removes via the close icon without bubbling the click to the parent', () => {
    const onClose = vi.fn();
    const onParentClick = vi.fn();
    render(
      <div onClick={onParentClick}>
        <RemovableChip onClose={onClose} data-testid="chip" closeButtonProps={{ 'aria-label': 'Удалить Марс' }}>
          Марс
        </RemovableChip>
      </div>,
    );
    const chip = screen.getByTestId('chip');
    fireEvent.click(screen.getByText('Марс'));
    expect(onClose).not.toHaveBeenCalled();
    expect(onParentClick).toHaveBeenCalledOnce();
    fireEvent.click(within(chip).getByRole('button', { name: 'Удалить Марс' }).querySelector('svg')!);
    expect(onClose).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledWith();
    expect(onParentClick).toHaveBeenCalledOnce();
  });

  it.each(['Enter', ' ', 'Backspace'])('removes with %j from the root and prevents its default action', (key) => {
    const onClose = vi.fn();
    const onKeyDown = vi.fn();
    const onClick = vi.fn();
    render(
      <RemovableChip data-testid="chip" onClose={onClose} onKeyDown={onKeyDown} onClick={onClick}>
        Марс
      </RemovableChip>,
    );

    expect(fireEvent.keyDown(screen.getByTestId('chip'), { key })).toBe(false);
    expect(onClose).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(onKeyDown.mock.invocationCallOrder[0]);
  });

  it('forwards the body onClick without removal and does not call it for the close button', () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(
      <RemovableChip data-testid="chip" onClick={onClick} onClose={onClose}>
        Марс
      </RemovableChip>,
    );
    const chip = screen.getByTestId('chip');
    fireEvent.click(screen.getByText('Марс'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
    expect(onClick.mock.calls[0][0].target).toBe(screen.getByText('Марс'));
    fireEvent.click(chip.querySelector('button')!);
    expect(onClose).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each(['Delete', 'ArrowRight', 'Escape'])('only forwards %s to onKeyDown', (key) => {
    const onClose = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <RemovableChip data-testid="chip" onClose={onClose} onKeyDown={onKeyDown}>
        Марс
      </RemovableChip>,
    );

    expect(fireEvent.keyDown(screen.getByTestId('chip'), { key })).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it.each([{ disabled: true }, { readOnly: true }])('blocks removal and onKeyDown with %j', (state) => {
    const onClose = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <RemovableChip {...state} data-testid="chip" onClose={onClose} onKeyDown={onKeyDown}>
        Марс
      </RemovableChip>,
    );
    const chip = screen.getByTestId('chip');

    expect(chip).toHaveAttribute('aria-disabled', 'true');
    expect(chip).toHaveAttribute('tabindex', state.disabled ? '-1' : '0');
    for (const key of ['Enter', ' ', 'Backspace', 'Escape']) fireEvent.keyDown(chip, { key });
    const close = chip.querySelector('button');
    if (state.disabled) {
      expect(close).toBeDisabled();
      fireEvent.click(close!);
      close!.click();
    } else {
      expect(close).toBeNull();
    }
    expect(onClose).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it('restores the close button and activation when readOnly is removed', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <RemovableChip readOnly data-testid="chip" onClose={onClose}>
        Марс
      </RemovableChip>,
    );
    const chip = screen.getByTestId('chip');
    rerender(
      <RemovableChip data-testid="chip" onClose={onClose}>
        Марс
      </RemovableChip>,
    );

    expect(chip).not.toHaveAttribute('aria-disabled');
    fireEvent.click(chip.querySelector('button')!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('forwards variant markers and close button DOM attributes', () => {
    render(
      <RemovableChip
        onClose={vi.fn()}
        dimension="l"
        appearance="flat"
        colorMode="neutral"
        closeButtonProps={{ 'aria-label': 'Убрать фильтр', 'aria-describedby': 'hint', title: 'Убрать' }}
        badge={0}
        avatar={<span data-testid="avatar">М</span>}
        iconsBefore={<svg data-testid="icon" />}
        data-testid="chip"
      >
        Марс
      </RemovableChip>,
    );
    const chip = screen.getByTestId('chip');
    expect(chip).toHaveAttribute('data-dimension', 'l');
    expect(chip).toHaveAttribute('data-appearance', 'flat');
    expect(chip).toHaveAttribute('data-color-mode', 'neutral');
    const close = within(chip).getByRole('button', { name: 'Убрать фильтр' });
    expect(close).toHaveAttribute('aria-describedby', 'hint');
    expect(close).toHaveAttribute('title', 'Убрать');
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('avatar')).toBeVisible();
    expect(screen.getByText('0')).toHaveAttribute('data-badge');
  });

  it('lets the user override tabIndex and aria-disabled', () => {
    render(
      <RemovableChip disabled tabIndex={3} aria-disabled="false" onClose={vi.fn()} data-testid="chip">
        Марс
      </RemovableChip>,
    );
    expect(screen.getByTestId('chip')).toHaveAttribute('tabindex', '3');
    expect(screen.getByTestId('chip')).toHaveAttribute('aria-disabled', 'false');
  });
});
