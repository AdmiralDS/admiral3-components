import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useClickTrigger } from './useClickTrigger';

describe('useClickTrigger', () => {
  afterEach(cleanup);

  it('opens and closes the floating element from the trigger', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    document.body.append(target, hint);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.floatingProps.ref(hint);
    });

    expect(result.current.floatingProps.showCloseIcon).toBe(true);
    expect(result.current.triggerProps['aria-expanded']).toBe(false);
    fireEvent.click(target);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.triggerProps['aria-expanded']).toBe(true);
    expect(result.current.triggerProps).not.toHaveProperty('aria-describedby');
    expect(result.current.triggerProps['aria-controls']).toBe(result.current.floatingProps.id);
    expect(result.current.triggerProps['aria-haspopup']).toBe('dialog');
    expect(result.current.floatingProps.role).toBe('dialog');
    expect(result.current.floatingProps['aria-labelledby']).toBe(result.current.triggerProps.id);
    fireEvent.click(target);
    expect(result.current.isVisible).toBe(false);
  });

  it.each(['Enter', ' '])('toggles the floating element with the %s activation key', (key) => {
    const target = document.createElement('div');
    const { result } = renderHook(() => useClickTrigger<HTMLDivElement>());

    act(() => result.current.triggerProps.ref(target));
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    fireEvent(target, event);
    expect(result.current.isVisible).toBe(true);
    expect(event.defaultPrevented).toBe(true);

    fireEvent.keyDown(target, { key });
    expect(result.current.isVisible).toBe(false);
  });

  it('closes from its close callback, on Escape and on an outside click', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const hintChild = document.createElement('button');
    const outside = document.createElement('button');
    hint.append(hintChild);
    document.body.append(target, hint, outside);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.floatingProps.ref(hint);
    });

    fireEvent.click(target);
    fireEvent.click(hintChild);
    expect(result.current.isVisible).toBe(true);
    act(() => result.current.floatingProps.onClose?.());
    expect(result.current.isVisible).toBe(false);

    fireEvent.click(target);
    outside.focus();
    fireEvent.keyDown(hint, { key: 'Escape' });
    expect(result.current.isVisible).toBe(false);
    expect(target).toHaveFocus();

    fireEvent.click(target);
    fireEvent.click(outside);
    expect(result.current.isVisible).toBe(false);
  });

  it('allows an element inside the floating element to consume Escape', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const hintChild = document.createElement('button');
    hint.append(hintChild);
    document.body.append(target, hint);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.floatingProps.ref(hint);
    });
    hintChild.addEventListener('keydown', (event) => event.stopPropagation());

    fireEvent.click(target);
    fireEvent.keyDown(hintChild, { key: 'Escape' });

    expect(result.current.isVisible).toBe(true);
  });

  it('does not move focus into the floating element after pointer activation', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const first = document.createElement('button');
    hint.append(first);
    document.body.append(target, hint);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.floatingProps.ref(hint);
    });

    target.focus();
    fireEvent.pointerDown(target, { pointerType: 'mouse' });
    fireEvent.click(target);

    expect(result.current.isVisible).toBe(true);
    expect(target).toHaveFocus();
    expect(first).not.toHaveFocus();
  });

  it('closes an already open floating element after keyboard activation of its trigger', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const first = document.createElement('button');
    hint.append(first);
    document.body.append(target, hint);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.floatingProps.ref(hint);
    });

    target.focus();
    fireEvent.pointerDown(target, { pointerType: 'mouse' });
    fireEvent.click(target);
    expect(target).toHaveFocus();

    fireEvent.keyDown(target, { key: 'Enter' });
    expect(result.current.isVisible).toBe(false);
    expect(target).toHaveFocus();
  });

  it('does not move focus into the floating element after touch activation', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const first = document.createElement('button');
    hint.append(first);
    document.body.append(target, hint);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.floatingProps.ref(hint);
    });

    target.focus();
    fireEvent.pointerDown(target, { pointerType: 'touch' });
    fireEvent.click(target);

    expect(result.current.isVisible).toBe(true);
    expect(target).toHaveFocus();
    expect(first).not.toHaveFocus();
  });

  it('moves focus into the floating element after keyboard activation and manages subsequent navigation', () => {
    const target = document.createElement('button');
    const next = document.createElement('button');
    const hint = document.createElement('div');
    const first = document.createElement('button');
    const last = document.createElement('button');
    hint.append(first, last);
    document.body.append(target, next, hint);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.floatingProps.ref(hint);
    });

    fireEvent.keyDown(target, { key: 'Enter' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(result.current.isVisible).toBe(false);
    expect(target).toHaveFocus();

    fireEvent.keyDown(target, { key: ' ' });
    expect(first).toHaveFocus();
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(result.current.isVisible).toBe(false);
    expect(next).toHaveFocus();
  });

  it('uses a separate positioning element without treating it as part of the click area', () => {
    const target = document.createElement('button');
    const positionTarget = document.createElement('div');
    document.body.append(target, positionTarget);
    const { result } = renderHook(() => useClickTrigger<HTMLButtonElement>({ targetElement: positionTarget }));

    act(() => result.current.triggerProps.ref(target));
    expect(result.current.floatingProps.targetElement).toBe(positionTarget);
    fireEvent.click(target);
    fireEvent.click(positionTarget);
    expect(result.current.isVisible).toBe(false);
  });
});
