import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SelectableChip } from './SelectableChip';

describe('SelectableChip', () => {
  afterEach(cleanup);

  it('renders a focusable root, forwards ref and exposes default markers', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SelectableChip ref={ref} data-testid="chip">
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button', { name: 'Марс' });

    expect(ref.current).toBe(chip);
    expect(chip).toBe(screen.getByTestId('chip'));
    expect(chip).toHaveAttribute('tabindex', '0');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(chip.querySelector('div')).toBeNull();
    expect(chip).toHaveAttribute('data-dimension', 'm');
    expect(chip).toHaveAttribute('data-appearance', 'outlined');
    expect(chip).toHaveAttribute('data-color-mode', 'colored');
  });

  it('keeps selected controlled and updates variant markers on rerender', () => {
    const onClick = vi.fn();
    const onChangeSelected = vi.fn();
    const { rerender } = render(
      <SelectableChip
        selected={false}
        onClick={onClick}
        onChangeSelected={onChangeSelected}
        dimension="s"
        appearance="flat"
        colorMode="neutral"
      >
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button', { name: 'Марс' });

    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(chip).toHaveAttribute('data-dimension', 's');
    expect(chip).toHaveAttribute('data-appearance', 'flat');
    expect(chip).toHaveAttribute('data-color-mode', 'neutral');
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onChangeSelected).toHaveBeenCalledWith(true);
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <SelectableChip selected onClick={onClick} onChangeSelected={onChangeSelected}>
        Марс
      </SelectableChip>,
    );
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveAttribute('data-dimension', 'm');
    expect(chip).toHaveAttribute('data-appearance', 'outlined');
    expect(chip).toHaveAttribute('data-color-mode', 'colored');
    fireEvent.click(chip);
    expect(onChangeSelected).toHaveBeenLastCalledWith(false);
    expect(onChangeSelected).toHaveBeenCalledTimes(2);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it.each([
    [undefined, true],
    [false, true],
    [true, false],
  ] as const)('requests selection on click when selected is %j', (selected, nextSelected) => {
    const onClick = vi.fn();
    const onChangeSelected = vi.fn();
    render(
      <SelectableChip selected={selected} onClick={onClick} onChangeSelected={onChangeSelected}>
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button');

    fireEvent.click(chip);
    expect(onChangeSelected).toHaveBeenCalledExactlyOnceWith(nextSelected);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0].target).toBe(chip);
    expect(onChangeSelected.mock.invocationCallOrder[0]).toBeLessThan(onClick.mock.invocationCallOrder[0]);
    expect(chip).not.toHaveAttribute('onChangeSelected');
  });

  it.each(
    ['Enter', ' '].flatMap((key) =>
      [undefined, false, true].map((selected) => ({ key, selected, nextSelected: !selected })),
    ),
  )('requests selection with "$key" when selected is $selected', ({ key, selected, nextSelected }) => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const onChangeSelected = vi.fn();
    render(
      <SelectableChip selected={selected} onClick={onClick} onKeyDown={onKeyDown} onChangeSelected={onChangeSelected}>
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button');

    expect(fireEvent.keyDown(chip, { key })).toBe(false);
    expect(onChangeSelected).toHaveBeenCalledExactlyOnceWith(nextSelected);
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(true);
    expect(onChangeSelected.mock.invocationCallOrder[0]).toBeLessThan(onKeyDown.mock.invocationCallOrder[0]);
  });

  it('forwards click and keyboard handlers without onChangeSelected', () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <SelectableChip onClick={onClick} onKeyDown={onKeyDown}>
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button');

    fireEvent.click(chip);
    expect(fireEvent.keyDown(chip, { key: ' ' })).toBe(false);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it.each(['Backspace', 'Delete', 'ArrowRight', 'Escape'])('only forwards %s to onKeyDown', (key) => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const onChangeSelected = vi.fn();
    render(
      <SelectableChip onClick={onClick} onKeyDown={onKeyDown} onChangeSelected={onChangeSelected}>
        Марс
      </SelectableChip>,
    );

    expect(fireEvent.keyDown(screen.getByRole('button'), { key })).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
    expect(onChangeSelected).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it.each([{ disabled: true }, { readOnly: true }])('blocks the main action and onKeyDown with %j', (state) => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const onChangeSelected = vi.fn();
    render(
      <SelectableChip
        {...state}
        selected
        iconsAfter={<span>После</span>}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onChangeSelected={onChangeSelected}
      >
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button');

    expect(chip).toHaveAttribute('aria-disabled', 'true');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveAttribute('tabindex', state.disabled ? '-1' : '0');
    fireEvent.click(chip);
    chip.click();
    fireEvent.click(screen.getByText('После'));
    for (const key of ['Enter', ' ', 'Backspace', 'Escape']) fireEvent.keyDown(chip, { key });
    expect(onClick).not.toHaveBeenCalled();
    expect(onChangeSelected).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it('restores interaction when disabled is removed', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <SelectableChip disabled onClick={onClick}>
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button');
    rerender(<SelectableChip onClick={onClick}>Марс</SelectableChip>);

    expect(chip).not.toHaveAttribute('aria-disabled');
    expect(chip).toHaveAttribute('tabindex', '0');
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards user-controlled DOM attributes and non-action handlers', () => {
    const onFocus = vi.fn();
    render(
      <SelectableChip disabled tabIndex={3} aria-disabled="false" aria-label="Планета" onFocus={onFocus}>
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByRole('button', { name: 'Планета' });

    expect(chip).toHaveAttribute('tabindex', '3');
    expect(chip).toHaveAttribute('aria-disabled', 'false');
    fireEvent.focus(chip);
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('renders iconsBefore, avatar, content, badge and iconsAfter in order', () => {
    render(
      <SelectableChip
        data-testid="chip"
        iconsBefore={<svg data-testid="icon-before" />}
        avatar={<span data-testid="avatar">М</span>}
        badge={0}
        iconsAfter={<svg data-testid="icon-after" />}
      >
        Марс
      </SelectableChip>,
    );
    const chip = screen.getByTestId('chip');
    const before = screen.getByTestId('icon-before').parentElement;
    const avatar = screen.getByTestId('avatar').parentElement;
    const after = screen.getByTestId('icon-after').parentElement;
    const badge = screen.getByText('0');

    expect(Array.from(chip.children)).toEqual([before, avatar, screen.getByText('Марс'), badge, after]);
    expect(before).toHaveAttribute('aria-hidden', 'true');
    expect(after).toHaveAttribute('aria-hidden', 'true');
    expect(avatar).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('avatar')).toBeVisible();
    expect(badge).toHaveAttribute('data-badge');
    expect(chip).not.toHaveAttribute('iconsBefore');
    expect(chip).not.toHaveAttribute('iconsAfter');
    expect(chip).not.toHaveAttribute('avatar');
    expect(chip.querySelector('button')).toBeNull();
    expect(before).not.toHaveAttribute('tabindex');
    expect(after).not.toHaveAttribute('tabindex');
  });

  it('activates the main action when iconsAfter is clicked without changing selected', () => {
    const onClick = vi.fn();
    const onChangeSelected = vi.fn();
    render(
      <SelectableChip
        selected={false}
        onClick={onClick}
        onChangeSelected={onChangeSelected}
        iconsAfter={<span>После</span>}
      >
        Марс
      </SelectableChip>,
    );
    fireEvent.click(screen.getByText('После'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onChangeSelected).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole('button', { name: 'Марс' })).toHaveAttribute('aria-pressed', 'false');
  });

  it.each([0, 'После'])('keeps visible iconsAfter content %j in a decorative wrapper', (content) => {
    render(<SelectableChip iconsAfter={content}>Марс</SelectableChip>);
    expect(screen.getByText(String(content)).parentElement).toHaveAttribute('role', 'button');
    expect(screen.getByText(String(content))).toHaveAttribute('aria-hidden', 'true');
  });

  it('removes and restores the iconsAfter wrapper when its content changes', () => {
    const { rerender } = render(<SelectableChip iconsAfter={<span>После</span>}>Марс</SelectableChip>);
    const chip = screen.getByRole('button', { name: 'Марс' });
    expect(chip.children).toHaveLength(2);
    rerender(<SelectableChip iconsAfter={null}>Марс</SelectableChip>);
    expect(chip.children).toHaveLength(1);
    rerender(<SelectableChip iconsAfter={<span>Новая иконка</span>}>Марс</SelectableChip>);
    expect(chip.children).toHaveLength(2);
    expect(screen.getByText('Новая иконка').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([null, undefined, false, true, ''])('does not add wrappers for empty slots %j', (slot) => {
    render(
      <SelectableChip iconsBefore={slot} avatar={slot} iconsAfter={slot}>
        Марс
      </SelectableChip>,
    );
    expect(screen.getByRole('button').children).toHaveLength(1);
  });
});
