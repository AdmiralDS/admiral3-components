import { createContext, useContext, useLayoutEffect, useRef, type PropsWithChildren } from 'react';

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useRovingFocus, type UseRovingFocusResult } from './useRovingFocus';

interface TestGroupProps extends PropsWithChildren {
  entryItemId?: string;
  orientation?: 'horizontal' | 'vertical';
  preventNavigation?: boolean;
}

const TestGroupContext = createContext<UseRovingFocusResult<HTMLButtonElement, string> | null>(null);

const TestGroup = ({ children, entryItemId, orientation, preventNavigation }: TestGroupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rovingFocus = useRovingFocus<HTMLButtonElement, string>({ containerRef, entryItemId, orientation });

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

  useLayoutEffect(() => registerItem({ id, ref: itemRef, disabled }), [disabled, id, registerItem]);
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
});
