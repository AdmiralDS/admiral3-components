import { createContext, useContext, useLayoutEffect, useRef, type PropsWithChildren } from 'react';

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useRovingFocus, type UseRovingFocusOptions, type UseRovingFocusResult } from './useRovingFocus';

interface TestGroupProps extends PropsWithChildren {
  entryItemId?: string;
  orientation?: 'horizontal' | 'vertical';
  preventNavigation?: boolean;
  isItemAvailable?: UseRovingFocusOptions<HTMLButtonElement, string>['isItemAvailable'];
}

const TestGroupContext = createContext<UseRovingFocusResult<HTMLButtonElement, string> | null>(null);

const TestGroup = ({ children, entryItemId, orientation, preventNavigation, isItemAvailable }: TestGroupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rovingFocus = useRovingFocus<HTMLButtonElement, string>({
    containerRef,
    entryItemId,
    orientation,
    isItemAvailable: isItemAvailable ? (item) => isItemAvailable(item) : undefined,
  });

  return (
    <TestGroupContext.Provider value={rovingFocus}>
      <div
        ref={containerRef}
        role="group"
        onBlur={rovingFocus.onBlur}
        onFocus={rovingFocus.onFocus}
        onKeyDown={(event) => {
          if (preventNavigation) event.preventDefault();
          rovingFocus.onKeyDown(event);
        }}
      >
        {children}
      </div>
    </TestGroupContext.Provider>
  );
};

const TestItem = ({ id, disabled = false }: { id: string; disabled?: boolean }) => {
  const group = useContext(TestGroupContext);
  if (!group) throw new Error('TestItem must be used inside TestGroup');
  const { getItemTabIndex, registerItem, updateItem } = group;
  const itemRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => registerItem({ id, ref: itemRef }), [id, registerItem]);
  useLayoutEffect(() => updateItem(id, { disabled }), [disabled, id, updateItem]);

  return (
    <button ref={itemRef} disabled={disabled} tabIndex={getItemTabIndex(id)}>
      {id}
    </button>
  );
};

describe('useRovingFocus', () => {
  afterEach(cleanup);

  it('uses the configured entry item and skips disabled items', () => {
    render(
      <TestGroup entryItemId="second">
        <TestItem id="first" />
        <TestItem id="disabled" disabled />
        <TestItem id="second" />
      </TestGroup>,
    );

    const first = screen.getByRole('button', { name: 'first' });
    const second = screen.getByRole('button', { name: 'second' });
    expect(second).toHaveAttribute('tabindex', '0');

    act(() => second.focus());
    fireEvent.keyDown(second, { key: 'ArrowRight' });
    expect(first).toHaveFocus();
    expect(screen.getByRole('button', { name: 'disabled' })).toHaveAttribute('tabindex', '-1');
  });

  it('supports vertical navigation, Home and End', () => {
    render(
      <TestGroup orientation="vertical">
        <TestItem id="first" />
        <TestItem id="second" />
        <TestItem id="third" />
      </TestGroup>,
    );

    const first = screen.getByRole('button', { name: 'first' });
    const second = screen.getByRole('button', { name: 'second' });
    const third = screen.getByRole('button', { name: 'third' });
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: 'End' });
    expect(third).toHaveFocus();
    fireEvent.keyDown(third, { key: 'Home' });
    expect(first).toHaveFocus();
  });

  it('honors a consumer-cancelled keyboard event', () => {
    render(
      <TestGroup preventNavigation>
        <TestItem id="first" />
        <TestItem id="second" />
      </TestGroup>,
    );

    const first = screen.getByRole('button', { name: 'first' });
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(first).toHaveFocus();
  });

  it('recovers focus when the focused item disappears', async () => {
    const { rerender } = render(
      <TestGroup>
        <TestItem id="first" />
        <TestItem id="second" />
      </TestGroup>,
    );
    act(() => screen.getByRole('button', { name: 'second' }).focus());

    rerender(
      <TestGroup>
        <TestItem id="first" />
      </TestGroup>,
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'first' })).toHaveFocus());
  });

  it('recovers focus when a registered item becomes disabled', async () => {
    const view = (disabled: boolean) => (
      <TestGroup>
        <TestItem id="first" />
        <TestItem id="second" disabled={disabled} />
      </TestGroup>
    );
    const { rerender } = render(view(false));
    act(() => screen.getByRole('button', { name: 'second' }).focus());

    rerender(view(true));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'first' })).toHaveFocus();
      expect(screen.getByRole('button', { name: 'first' })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('button', { name: 'second' })).toHaveAttribute('tabindex', '-1');
    });
  });

  it('removes an updated registration without losing the remaining Tab stop', () => {
    const view = (disabled: boolean, showSecond = true) => (
      <>
        <TestGroup>
          <TestItem key="first" id="first" />
          {showSecond && <TestItem key="second" id="second" disabled={disabled} />}
        </TestGroup>
        <button>Outside</button>
      </>
    );
    const { rerender } = render(view(false));
    rerender(view(true));
    rerender(view(false));
    act(() => screen.getByRole('button', { name: 'second' }).focus());
    const outside = screen.getByRole('button', { name: 'Outside' });
    act(() => outside.focus());

    rerender(view(false, false));

    expect(outside).toHaveFocus();
    expect(screen.getByRole('button', { name: 'first' })).toHaveAttribute('tabindex', '0');
  });

  it('accepts an inline availability predicate and uses its latest value', () => {
    const InlineAvailabilityGroup = ({ excludedId }: { excludedId?: string }) => (
      <TestGroup isItemAvailable={(item) => !item.disabled && item.id !== excludedId && Boolean(item.ref.current)}>
        <TestItem id="first" />
        <TestItem id="second" />
        <TestItem id="third" />
      </TestGroup>
    );
    const { rerender } = render(<InlineAvailabilityGroup />);
    const first = screen.getByRole('button', { name: 'first' });
    const second = screen.getByRole('button', { name: 'second' });
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();

    rerender(<InlineAvailabilityGroup />);
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('tabindex', '0');

    rerender(<InlineAvailabilityGroup excludedId="second" />);
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'third' })).toHaveFocus();
  });

  it('updates availability outside the group without moving external focus', () => {
    const view = (excludedId?: string) => (
      <>
        <TestGroup
          entryItemId="second"
          isItemAvailable={(item) => !item.disabled && item.id !== excludedId && Boolean(item.ref.current)}
        >
          <TestItem id="first" />
          <TestItem id="second" />
        </TestGroup>
        <button>Outside</button>
      </>
    );
    const { rerender } = render(view());
    const first = screen.getByRole('button', { name: 'first' });
    const second = screen.getByRole('button', { name: 'second' });
    const outside = screen.getByRole('button', { name: 'Outside' });
    act(() => outside.focus());

    rerender(view('second'));
    expect(outside).toHaveFocus();
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');

    rerender(view());
    expect(outside).toHaveFocus();
    expect(second).toHaveAttribute('tabindex', '0');
    expect(first).toHaveAttribute('tabindex', '-1');
  });

  it.each(['removed', 'disabled'] as const)(
    'does not recover focus after re-registration, intentional blur and an item becoming %s',
    (action) => {
      const view = (entryItemId: string, unavailable = false) => (
        <TestGroup entryItemId={entryItemId}>
          {!(unavailable && action === 'removed') && (
            <TestItem key="first" id="first" disabled={unavailable && action === 'disabled'} />
          )}
          <TestItem key="second" id="second" />
        </TestGroup>
      );
      const { rerender } = render(view('first'));
      const first = screen.getByRole('button', { name: 'first' });
      act(() => first.focus());

      rerender(view('second'));
      expect(first).toHaveFocus();
      act(() => first.blur());
      expect(document.body).toHaveFocus();

      rerender(view('second', true));
      expect(document.body).toHaveFocus();
      expect(screen.getByRole('button', { name: 'second' })).toHaveAttribute('tabindex', '0');
    },
  );
});
