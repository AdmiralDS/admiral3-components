import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Chip } from './Chip';

describe('Chip', () => {
  afterEach(cleanup);

  it('forwards its root ref and click handler and exposes its variant markers', () => {
    const ref = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <Chip ref={ref} onClick={onClick} data-testid="chip" dimension="l" appearance="flat" colorMode="neutral">
        Категория
      </Chip>,
    );
    const chip = screen.getByTestId('chip');

    expect(ref.current).toBe(chip);
    expect(chip).toHaveAttribute('data-dimension', 'l');
    expect(chip).toHaveAttribute('data-appearance', 'flat');
    expect(chip).toHaveAttribute('data-color-mode', 'neutral');
    expect(chip).toHaveAttribute('tabindex', '0');
    expect(chip).not.toHaveAttribute('role');
    expect(chip).not.toHaveAttribute('aria-pressed');
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each([{ disabled: true }, { readOnly: true }])('blocks clicks with %j', (state) => {
    const onClick = vi.fn();
    render(
      <Chip {...state} data-testid="chip" onClick={onClick}>
        Категория
      </Chip>,
    );
    const chip = screen.getByTestId('chip');

    expect(chip).toHaveAttribute('aria-disabled', 'true');
    expect(chip).toHaveAttribute('tabindex', state.disabled ? '-1' : '0');
    fireEvent.click(chip);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders decorative icons, an avatar and a zero badge in order', () => {
    render(
      <Chip
        data-testid="chip"
        iconsBefore={<svg data-testid="before" />}
        iconsAfter={<svg data-testid="after" />}
        avatar={<span data-testid="avatar">К</span>}
        badge={0}
      >
        Категория
      </Chip>,
    );
    const chip = screen.getByTestId('chip');
    const before = screen.getByTestId('before').parentElement;
    const after = screen.getByTestId('after').parentElement;
    const avatar = screen.getByTestId('avatar').parentElement;
    const badge = screen.getByText('0');

    expect(Array.from(chip.children)).toEqual([before, avatar, screen.getByText('Категория'), badge, after]);
    expect(before).toHaveAttribute('aria-hidden', 'true');
    expect(after).toHaveAttribute('aria-hidden', 'true');
    expect(avatar).not.toHaveAttribute('aria-hidden');
    expect(badge).toHaveAttribute('data-badge');
  });

  it('updates the badge appearance when state or an override changes', () => {
    const { rerender } = render(
      <Chip badge={5} colorMode="neutral">
        Категория
      </Chip>,
    );
    const badge = screen.getByText('5');

    expect(badge).toHaveAttribute('data-appearance', 'neutral3');
    rerender(
      <Chip badge={5} colorMode="neutral" disabled>
        Категория
      </Chip>,
    );
    expect(badge).toHaveAttribute('data-appearance', 'neutral2Disable');
    rerender(
      <Chip badge={5} colorMode="neutral" disabled badgeAppearance="info">
        Категория
      </Chip>,
    );
    expect(badge).toHaveAttribute('data-appearance', 'info');
  });

  it.each(['mouseenter', 'focus'])('opens a Tooltip on %s for overflowing content', (trigger) => {
    render(<Chip data-testid="chip">Длинное название</Chip>);
    const chip = screen.getByTestId('chip');
    const content = screen.getByText('Длинное название');
    Object.defineProperties(content, {
      scrollWidth: { configurable: true, value: 200 },
      clientWidth: { configurable: true, value: 100 },
    });

    if (trigger === 'focus') fireEvent.focus(chip);
    else fireEvent.mouseEnter(chip);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Длинное название');
    fireEvent.keyDown(chip, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it.each([
    { showTooltip: false, scrollWidth: 200 },
    { showTooltip: true, scrollWidth: 100 },
  ])('does not open a Tooltip with %j', ({ showTooltip, scrollWidth }) => {
    render(
      <Chip data-testid="chip" showTooltip={showTooltip}>
        Категория
      </Chip>,
    );
    const chip = screen.getByTestId('chip');
    Object.defineProperties(screen.getByText('Категория'), {
      scrollWidth: { configurable: true, value: scrollWidth },
      clientWidth: { configurable: true, value: 100 },
    });

    fireEvent.mouseEnter(chip);
    fireEvent.focus(chip);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('disables and restores custom Tooltip content without remounting the chip', () => {
    const renderChip = (showTooltip: boolean) => (
      <Chip data-testid="chip" showTooltip={showTooltip} renderTooltipContent={() => <strong>Описание</strong>}>
        Название
      </Chip>
    );
    const { rerender } = render(renderChip(true));
    const chip = screen.getByTestId('chip');
    Object.defineProperties(screen.getByText('Название'), {
      scrollWidth: { configurable: true, value: 200 },
      clientWidth: { configurable: true, value: 100 },
    });

    fireEvent.mouseEnter(chip);
    expect(screen.getByRole('tooltip')).toContainElement(screen.getByText('Описание', { selector: 'strong' }));

    rerender(renderChip(false));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.focus(chip);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    rerender(renderChip(true));
    expect(screen.getByTestId('chip')).toBe(chip);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.focus(chip);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Описание');
    fireEvent.blur(chip, { relatedTarget: document.body });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
