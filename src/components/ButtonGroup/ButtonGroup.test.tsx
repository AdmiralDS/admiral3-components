import { createRef, useState } from 'react';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createPortal } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';

describe('ButtonGroup', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a labelled group and forwards native attributes and ref', () => {
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
    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveAccessibleName('Document actions');
    expect(group).toHaveAttribute('title', 'Actions');
    expect(group).toHaveClass('consumer-class');
    expect(ref.current).toBe(group);
  });

  it('keeps group semantics when unsupported native attributes are passed at runtime', () => {
    const nativeOverrides: React.HTMLAttributes<HTMLDivElement> = {
      role: 'toolbar',
    };

    render(
      <ButtonGroup {...nativeOverrides} aria-label="Actions" data-testid="button-group">
        <Button>Action</Button>
      </ButtonGroup>,
    );

    expect(screen.getByTestId('button-group')).toHaveAttribute('role', 'group');
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

  it('uses regular custom colors as disabled fallbacks inside the group', () => {
    render(
      <>
        <ButtonGroup
          aria-label="Solid actions"
          colorConfig={{
            backgroundColor: {
              rest: 'var(--group-button-background)',
              hover: 'var(--group-button-background-hover)',
              press: 'var(--group-button-background-press)',
            },
          }}
        >
          <Button disabled data-testid="solid-disabled">
            Solid
          </Button>
        </ButtonGroup>
        <ButtonGroup
          aria-label="Outline actions"
          appearance="outline"
          colorConfig={{ borderColor: 'var(--group-button-border)' }}
        >
          <Button disabled data-testid="outline-disabled">
            Outline
          </Button>
        </ButtonGroup>
      </>,
    );

    expect(screen.getByTestId('solid-disabled')).toHaveStyle({
      backgroundColor: 'var(--group-button-background)',
    });
    expect(screen.getByTestId('outline-disabled')).toHaveStyle({
      boxShadow: 'inset 0 0 0 1px var(--group-button-border)',
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

  it('keeps grouped Buttons out of the Tab sequence before client registration', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    expect(Array.from(container.querySelectorAll('button'), (button) => button.tabIndex)).toEqual([-1, -1]);
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

  it('handles arrow navigation when the event comes from a nested Button element', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>
          <span data-testid="first-button-content">First</span>
        </Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    first.focus();
    fireEvent.keyDown(screen.getByTestId('first-button-content'), { key: 'ArrowRight' });

    expect(second).toHaveFocus();
  });

  it('preserves autofocus when the second Button registers', async () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button autoFocus>Second</Button>
      </ButtonGroup>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    await waitFor(() => {
      expect(second).toHaveFocus();
      expect(second).toHaveAttribute('tabindex', '0');
      expect(first).toHaveAttribute('tabindex', '-1');
    });
  });

  it('updates the roving Tab stop when an enabled Button receives focus', async () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    second.focus();

    await waitFor(() => {
      expect(first).toHaveAttribute('tabindex', '-1');
      expect(second).toHaveAttribute('tabindex', '0');
    });
  });

  it('moves focus to the first enabled Button when the focused Button is removed', async () => {
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

    const first = screen.getByRole('button', { name: 'First' });
    await waitFor(() => {
      expect(first).toHaveFocus();
      expect(first).toHaveAttribute('tabindex', '0');
    });
  });

  it('keeps one Tab stop when a child component adds and removes Buttons', () => {
    const DynamicButtons = () => {
      const [showFirst, setShowFirst] = useState(true);
      const [showThird, setShowThird] = useState(false);

      return (
        <>
          {showFirst && <Button onClick={() => setShowFirst(false)}>First</Button>}
          <Button onClick={() => setShowThird(true)}>Second</Button>
          {showThird && <Button>Third</Button>}
        </>
      );
    };

    render(
      <ButtonGroup aria-label="Actions" data-testid="button-group">
        <DynamicButtons />
      </ButtonGroup>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    fireEvent.click(first);

    const second = screen.getByRole('button', { name: 'Second' });
    expect(second).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('button-group').querySelectorAll('[tabindex="0"]')).toHaveLength(1);

    fireEvent.click(second);

    expect(second).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Third' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByTestId('button-group').querySelectorAll('[tabindex="0"]')).toHaveLength(1);
  });

  it('owns tabIndex for registered Buttons', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button tabIndex={5}>First</Button>
        <Button tabIndex={6}>Second</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus to the first enabled Button when the focused Button becomes disabled', async () => {
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

    const first = screen.getByRole('button', { name: 'First' });
    await waitFor(() => {
      expect(first).toHaveFocus();
      expect(first).toHaveAttribute('tabindex', '0');
    });
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it.each(['disabled', 'skeleton'] as const)(
    'moves focus when a child Button changes its own %s state',
    async (state) => {
      const SelfUnavailableButton = () => {
        const [unavailable, setUnavailable] = useState(false);
        return (
          <Button
            data-testid="self-unavailable-button"
            disabled={state === 'disabled' && unavailable}
            skeleton={state === 'skeleton' && unavailable}
            onClick={() => setUnavailable(true)}
          >
            First
          </Button>
        );
      };

      render(
        <ButtonGroup aria-label="Actions">
          <SelfUnavailableButton />
          <Button>Second</Button>
        </ButtonGroup>,
      );

      const first = screen.getByTestId('self-unavailable-button');
      const second = screen.getByRole('button', { name: 'Second' });

      first.focus();
      fireEvent.click(first);

      await waitFor(() => {
        expect(second).toHaveFocus();
        expect(second).toHaveAttribute('tabindex', '0');
      });
      expect(first).toHaveAttribute('tabindex', '-1');
    },
  );

  it('does not move focus back into the group when focus is outside', async () => {
    const { rerender } = render(
      <>
        <Button>Outside</Button>
        <ButtonGroup aria-label="Actions">
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      </>,
    );

    screen.getByRole('button', { name: 'Second' }).focus();
    const outside = screen.getByRole('button', { name: 'Outside' });
    outside.focus();

    rerender(
      <>
        <Button>Outside</Button>
        <ButtonGroup aria-label="Actions">
          <Button>First</Button>
        </ButtonGroup>
      </>,
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '0'));
    expect(outside).toHaveFocus();
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

  it('keeps keyboard navigation within a nested ButtonGroup', () => {
    render(
      <ButtonGroup aria-label="Outer actions">
        <Button>Outer first</Button>
        <ButtonGroup aria-label="Inner actions">
          <Button>Inner first</Button>
          <Button>Inner second</Button>
        </ButtonGroup>
        <Button>Outer second</Button>
      </ButtonGroup>,
    );

    const innerFirst = screen.getByRole('button', { name: 'Inner first' });
    const innerSecond = screen.getByRole('button', { name: 'Inner second' });

    innerFirst.focus();
    fireEvent.keyDown(innerFirst, { key: 'ArrowRight' });

    expect(innerSecond).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Outer first' })).not.toHaveFocus();
    expect(screen.getByRole('button', { name: 'Outer second' })).not.toHaveFocus();
  });

  it('does not register a Button portalled outside its owning group', () => {
    const portalTarget = document.createElement('div');
    portalTarget.setAttribute('role', 'group');
    document.body.appendChild(portalTarget);

    const { unmount } = render(
      <ButtonGroup aria-label="Actions">
        <Button>Direct</Button>
        {createPortal(<Button>Portalled</Button>, portalTarget)}
      </ButtonGroup>,
    );

    try {
      const direct = screen.getByRole('button', { name: 'Direct' });
      const portalled = screen.getByRole('button', { name: 'Portalled' });

      expect(portalled).toHaveAttribute('tabindex', '0');

      direct.focus();
      fireEvent.keyDown(direct, { key: 'ArrowRight' });

      expect(direct).toHaveFocus();
      expect(portalled).not.toHaveFocus();

      portalled.focus();
      fireEvent.keyDown(portalled, { key: 'ArrowRight' });

      expect(portalled).toHaveFocus();
      expect(direct).not.toHaveFocus();
    } finally {
      unmount();
      portalTarget.remove();
    }
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
