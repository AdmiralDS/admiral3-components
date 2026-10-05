import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as overflowUtils from '#src/utils/checkOverflow';

import { RemovableChip } from './RemovableChip';
import { SelectableChip } from './SelectableChip';
import type { ChipBaseProps } from './types';

describe.each([
  { name: 'SelectableChip', Component: (props: ChipBaseProps) => <SelectableChip {...props} /> },
  {
    name: 'RemovableChip',
    Component: (props: ChipBaseProps) => <RemovableChip {...props} onClose={() => undefined} />,
  },
])('$name tooltip', ({ Component }) => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each(['hover', 'focus'])('shows the string content on %s only while overflowing', (trigger) => {
    const overflow = vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    render(<Component data-testid="chip">Полное название</Component>);
    const chip = screen.getByTestId('chip');

    expect(chip).not.toHaveAttribute('title');
    expect(overflow).not.toHaveBeenCalled();
    if (trigger === 'hover') fireEvent.mouseEnter(chip);
    else fireEvent.focus(chip);
    expect(chip).toHaveAttribute('title', 'Полное название');
    if (trigger === 'hover') fireEvent.mouseLeave(chip);
    else fireEvent.blur(chip);
    expect(chip).not.toHaveAttribute('title');
  });

  it('does not show a title when the content fits', () => {
    vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(false);
    render(<Component data-testid="chip">Короткий</Component>);
    const chip = screen.getByTestId('chip');
    fireEvent.mouseEnter(chip);
    expect(chip).not.toHaveAttribute('title');
  });

  it('uses custom tooltip content for non-string children', () => {
    vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    render(
      <Component data-testid="chip" renderContentTooltip={() => 'Описание'}>
        <span>Название</span>
      </Component>,
    );
    const chip = screen.getByTestId('chip');
    fireEvent.mouseEnter(chip);
    expect(chip).toHaveAttribute('title', 'Описание');
  });

  it('does not infer a tooltip from element children', () => {
    vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    render(
      <Component data-testid="chip">
        <span>Название</span>
      </Component>,
    );
    const chip = screen.getByTestId('chip');
    fireEvent.mouseEnter(chip);
    expect(chip).not.toHaveAttribute('title');
  });

  it('skips overflow checks when disabledTooltip is true', () => {
    const overflow = vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    render(
      <Component data-testid="chip" disabledTooltip renderContentTooltip={() => 'Описание'}>
        Название
      </Component>,
    );
    const chip = screen.getByTestId('chip');
    fireEvent.mouseEnter(chip);
    fireEvent.focus(chip);
    expect(chip).not.toHaveAttribute('title');
    expect(overflow).not.toHaveBeenCalled();
  });

  it('removes listeners when the tooltip is disabled and restores them when enabled', () => {
    const overflow = vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    const { rerender } = render(<Component data-testid="chip">Название</Component>);
    const chip = screen.getByTestId('chip');
    fireEvent.mouseEnter(chip);
    expect(chip).toHaveAttribute('title', 'Название');
    overflow.mockClear();

    rerender(
      <Component data-testid="chip" disabledTooltip>
        Название
      </Component>,
    );
    fireEvent.mouseEnter(chip);
    fireEvent.focus(chip);
    expect(chip).not.toHaveAttribute('title');
    expect(overflow).not.toHaveBeenCalled();

    rerender(<Component data-testid="chip">Другое название</Component>);
    fireEvent.focus(chip);
    expect(chip).toHaveAttribute('title', 'Другое название');
    expect(overflow).toHaveBeenCalledOnce();
  });
});
