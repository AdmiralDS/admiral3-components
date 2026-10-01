import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';

describe('ButtonGroup', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a labelled toolbar and forwards native attributes and ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ButtonGroup
        ref={ref}
        aria-label="Document actions"
        className="consumer-class"
        data-testid="button-group"
        title="Actions"
      >
        <Button>Save</Button>
      </ButtonGroup>,
    );

    const group = screen.getByTestId('button-group');

    expect(group.tagName).toBe('DIV');
    expect(group).toHaveAttribute('role', 'toolbar');
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(group).toHaveAccessibleName('Document actions');
    expect(group).toHaveAttribute('title', 'Actions');
    expect(group).toHaveClass('consumer-class');
    expect(ref.current).toBe(group);
  });

  it('keeps toolbar semantics when unsupported native attributes are passed at runtime', () => {
    const nativeOverrides: React.HTMLAttributes<HTMLDivElement> = {
      role: 'group',
      'aria-orientation': 'vertical',
    };

    render(
      <ButtonGroup {...nativeOverrides} aria-label="Actions" data-testid="button-group">
        <Button>Action</Button>
      </ButtonGroup>,
    );

    expect(screen.getByTestId('button-group')).toHaveAttribute('role', 'toolbar');
    expect(screen.getByTestId('button-group')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('uses default group appearance, color mode and dimension for every Button', () => {
    render(
      <ButtonGroup aria-label="Actions" data-testid="button-group">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    const group = screen.getByTestId('button-group');
    const buttons = screen.getAllByRole('button');

    expect(group).toHaveAttribute('data-appearance', 'solid');
    expect(group).toHaveAttribute('data-color-mode', 'colored');
    expect(group).toHaveAttribute('data-dimension', 'm');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('data-appearance', 'solid');
      expect(button).toHaveAttribute('data-color-mode', 'colored');
      expect(button).toHaveAttribute('data-dimension', 'm');
    });
  });

  it('overrides conflicting visual props on child Buttons without forwarding group props to the DOM', () => {
    render(
      <ButtonGroup aria-label="Actions" appearance="flat" colorMode="neutral" dimension="xs" data-testid="button-group">
        <Button
          appearance="outline"
          colorMode="staticWhite"
          dimension="l"
          colorConfig={{ textColor: 'var(--child-button-text)' }}
        >
          Action
        </Button>
      </ButtonGroup>,
    );

    const group = screen.getByTestId('button-group');
    const button = screen.getByRole('button', { name: 'Action' });

    expect(group).not.toHaveAttribute('appearance');
    expect(group).not.toHaveAttribute('colorMode');
    expect(group).not.toHaveAttribute('dimension');
    expect(button).toHaveAttribute('data-appearance', 'flat');
    expect(button).toHaveAttribute('data-color-mode', 'neutral');
    expect(button).toHaveAttribute('data-dimension', 'xs');
  });

  it('applies the group color config to every Button and ignores a child color config', () => {
    render(
      <ButtonGroup
        aria-label="Actions"
        appearance="outline"
        colorConfig={{
          borderColor: 'var(--group-button-border)',
          textColor: 'var(--group-button-text)',
        }}
        data-testid="button-group"
      >
        <Button colorConfig={{ textColor: 'var(--child-button-text)' }}>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    expect(screen.getByTestId('button-group')).toHaveAttribute('data-appearance', 'custom');
    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAttribute('data-appearance', 'custom');
      expect(button).toHaveStyle({
        color: 'var(--group-button-text)',
        boxShadow: 'inset 0 0 0 1px var(--group-button-border)',
      });
    });
  });

  it('keeps one Tab stop when the group color config changes', () => {
    const { rerender } = render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    rerender(
      <ButtonGroup aria-label="Actions" colorConfig={{ textColor: 'var(--group-button-text)' }}>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('keeps only the first enabled Button in the Tab sequence', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button disabled>Disabled</Button>
        <Button skeleton data-testid="skeleton-button">
          Skeleton
        </Button>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('button', { name: 'Disabled' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByTestId('skeleton-button')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus circularly, skips disabled Buttons and supports Home and End', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button disabled>Disabled</Button>
        <Button>Second</Button>
        <Button>Last</Button>
      </ButtonGroup>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    const last = screen.getByRole('button', { name: 'Last' });

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowLeft' });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: 'ArrowRight' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: 'End' });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: 'Home' });
    expect(first).toHaveFocus();
  });

  it('updates the roving Tab stop when an enabled Button receives focus', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    second.focus();

    expect(first).toHaveAttribute('tabindex', '-1');
    expect(second).toHaveAttribute('tabindex', '0');
  });

  it('selects the first enabled Button when the active Button is removed', () => {
    const { rerender } = render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    screen.getByRole('button', { name: 'Second' }).focus();

    rerender(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '0');
  });

  it('selects the first enabled Button when the active Button becomes disabled', () => {
    const { rerender } = render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    screen.getByRole('button', { name: 'Second' }).focus();

    rerender(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button disabled>Second</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('has no Tab stop when all direct Buttons are disabled', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button disabled>First</Button>
        <Button disabled>Second</Button>
      </ButtonGroup>,
    );

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAttribute('tabindex', '-1');
    });
  });

  it('does not manage focus for nested Buttons', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>Direct</Button>
        <div>
          <Button>Nested</Button>
        </div>
      </ButtonGroup>,
    );

    expect(screen.getByRole('button', { name: 'Direct' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Nested' })).toHaveAttribute('tabindex', '0');
  });

  it.each(['Tab', 'Enter', ' '])('does not intercept %s', (key) => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    expect(fireEvent.keyDown(screen.getByRole('button', { name: 'First' }), { key })).toBe(true);
  });

  it('calls consumer handlers and respects prevented keyboard events', () => {
    const handleFocus = vi.fn();
    const handleKeyDown = vi.fn((event: React.KeyboardEvent<HTMLDivElement>) => event.preventDefault());

    render(
      <ButtonGroup aria-label="Actions" onFocus={handleFocus} onKeyDown={handleKeyDown}>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });

    expect(handleFocus).toHaveBeenCalledOnce();
    expect(handleKeyDown).toHaveBeenCalledOnce();
    expect(first).toHaveFocus();
  });
});
