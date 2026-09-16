import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Pill } from './Pill';
import { Pills } from './Pills';

describe('Pills', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a toolbar and forwards native attributes and ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Pills ref={ref} aria-label="Statuses" className="consumer-class" data-testid="pills">
        <Pill>First</Pill>
      </Pills>,
    );

    const pills = screen.getByTestId('pills');

    expect(pills.tagName).toBe('DIV');
    expect(pills).toHaveAttribute('role', 'toolbar');
    expect(pills).toHaveAttribute('aria-orientation', 'horizontal');
    expect(pills).toHaveAccessibleName('Statuses');
    expect(pills).toHaveClass('consumer-class');
    expect(ref.current).toBe(pills);
  });

  it('marks connected layout without forwarding the prop', () => {
    render(
      <Pills connected data-testid="pills">
        <Pill>First</Pill>
        <Pill>Last</Pill>
      </Pills>,
    );

    expect(screen.getByTestId('pills')).toHaveAttribute('data-connected', '');
    expect(screen.getByTestId('pills')).not.toHaveAttribute('connected');
    expect(screen.getByTestId('pills')).toHaveStyle({ gap: '0px', flexWrap: 'nowrap' });
  });

  it('uses separated wrapping layout by default', () => {
    render(
      <Pills data-testid="pills">
        <Pill>First</Pill>
        <Pill>Last</Pill>
      </Pills>,
    );

    expect(screen.getByTestId('pills')).not.toHaveAttribute('data-connected');
    expect(screen.getByTestId('pills')).toHaveStyle({ gap: '4px', flexWrap: 'wrap' });
  });

  it('keeps only the first enabled Pill in the Tab sequence', () => {
    render(
      <Pills aria-label="Statuses">
        <Pill disabled>Disabled</Pill>
        <Pill>First</Pill>
        <Pill>Second</Pill>
      </Pills>,
    );

    expect(screen.getByRole('button', { name: 'Disabled' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus circularly and supports Home and End', () => {
    render(
      <Pills aria-label="Statuses">
        <Pill>First</Pill>
        <Pill disabled>Disabled</Pill>
        <Pill>Second</Pill>
        <Pill>Last</Pill>
      </Pills>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    const last = screen.getByRole('button', { name: 'Last' });

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowLeft' });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: 'ArrowRight' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'End' });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: 'Home' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();
  });

  it('updates the roving Tab stop when a Pill receives focus', () => {
    render(
      <Pills aria-label="Statuses">
        <Pill>First</Pill>
        <Pill>Second</Pill>
      </Pills>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    second.focus();

    expect(first).toHaveAttribute('tabindex', '-1');
    expect(second).toHaveAttribute('tabindex', '0');
  });

  it('does not intercept Tab', () => {
    render(
      <Pills aria-label="Statuses">
        <Pill>First</Pill>
        <Pill>Second</Pill>
      </Pills>,
    );

    expect(fireEvent.keyDown(screen.getByRole('button', { name: 'First' }), { key: 'Tab' })).toBe(true);
  });

  it('activates a menu trigger with ArrowDown', () => {
    const handleClick = vi.fn();

    render(
      <Pills aria-label="Statuses">
        <Pill aria-haspopup="menu" onClick={handleClick}>
          Menu
        </Pill>
      </Pills>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Menu' }), { key: 'ArrowDown' });

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('respects a consumer keydown handler that prevents the default behavior', () => {
    render(
      <Pills aria-label="Statuses" onKeyDown={(event) => event.preventDefault()}>
        <Pill>First</Pill>
        <Pill>Second</Pill>
      </Pills>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });

    expect(first).toHaveFocus();
  });
});
