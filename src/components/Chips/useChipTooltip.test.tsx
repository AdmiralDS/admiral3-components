import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RemovableChip } from './RemovableChip';
import { SelectableChip } from './SelectableChip';
import type { ChipBaseProps } from './types';

const setContentOverflow = (content: HTMLElement, overflow: boolean) => {
  Object.defineProperties(content, {
    scrollWidth: { configurable: true, value: overflow ? 200 : 100 },
    clientWidth: { configurable: true, value: 100 },
  });
};

describe.each([
  { name: 'SelectableChip', Component: (props: ChipBaseProps) => <SelectableChip {...props} /> },
  {
    name: 'RemovableChip',
    Component: (props: ChipBaseProps) => <RemovableChip {...props} onClose={() => undefined} />,
  },
])('$name Tooltip', ({ Component }) => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each(['hover', 'focus'])('shows children on %s only while the content overflows', (trigger) => {
    render(<Component data-testid="chip">Полное название</Component>);
    const chip = screen.getByTestId('chip');
    setContentOverflow(screen.getByText('Полное название'), true);

    if (trigger === 'hover') fireEvent.mouseEnter(chip);
    else fireEvent.focus(chip);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Полное название');

    if (trigger === 'hover') fireEvent.mouseLeave(chip, { relatedTarget: document.body });
    else fireEvent.blur(chip, { relatedTarget: document.body });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not show Tooltip when the content fits', () => {
    render(<Component data-testid="chip">Короткий</Component>);
    setContentOverflow(screen.getByText('Короткий'), false);

    fireEvent.mouseEnter(screen.getByTestId('chip'));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows Tooltip when readOnly', () => {
    render(
      <Component data-testid="chip" readOnly>
        Полное название
      </Component>,
    );
    setContentOverflow(screen.getByText('Полное название'), true);

    fireEvent.mouseEnter(screen.getByTestId('chip'));

    expect(screen.getByRole('tooltip')).toHaveTextContent('Полное название');
  });

  it('renders custom React content in Tooltip', () => {
    render(
      <Component data-testid="chip" renderTooltipContent={() => <strong>Описание</strong>}>
        <span>Название</span>
      </Component>,
    );
    setContentOverflow(screen.getByText('Название').parentElement as HTMLElement, true);

    fireEvent.mouseEnter(screen.getByTestId('chip'));

    expect(screen.getByRole('tooltip')).toContainElement(screen.getByText('Описание'));
  });

  it('does not attach Tooltip listeners when showTooltip is false', () => {
    const addEventListener = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    render(
      <Component data-testid="chip" showTooltip={false}>
        Название
      </Component>,
    );
    const chip = screen.getByTestId('chip');
    setContentOverflow(screen.getByText('Название'), true);

    fireEvent.mouseEnter(chip);
    fireEvent.focus(chip);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(
      addEventListener.mock.calls.some(([eventName]) =>
        ['mouseenter', 'mouseleave', 'focus', 'blur'].includes(String(eventName)),
      ),
    ).toBe(false);
  });

  it('disables and restores Tooltip without remounting the chip', () => {
    const { rerender } = render(<Component data-testid="chip">Название</Component>);
    const chip = screen.getByTestId('chip');
    setContentOverflow(screen.getByText('Название'), true);
    fireEvent.mouseEnter(chip);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Название');

    rerender(
      <Component data-testid="chip" showTooltip={false}>
        Название
      </Component>,
    );
    expect(screen.getByTestId('chip')).toBe(chip);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    rerender(<Component data-testid="chip">Другое название</Component>);
    setContentOverflow(screen.getByText('Другое название'), true);
    fireEvent.focus(chip);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Другое название');
  });
});
