import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useHint } from './useHint';

describe('useHint', () => {
  afterEach(cleanup);

  it('provides linked target and Hint props and controls visibility', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    document.body.append(target, hint);
    const { result } = renderHook(() => useHint<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.hintProps.ref(hint);
    });

    expect(result.current.hintProps.targetElement).toBe(target);
    fireEvent.mouseEnter(target);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.triggerProps['aria-describedby']).toBe(result.current.hintProps.id);
    fireEvent.keyDown(target, { key: 'Escape' });
    expect(result.current.isVisible).toBe(false);
  });

  it('positions relative to a separate element while opening from the target', () => {
    const target = document.createElement('button');
    const positionTarget = document.createElement('div');
    const { result } = renderHook(() => useHint<HTMLButtonElement>({ targetElement: positionTarget }));

    act(() => result.current.triggerProps.ref(target));
    expect(result.current.hintProps.targetElement).toBe(positionTarget);
    fireEvent.focus(target);
    expect(result.current.isVisible).toBe(true);
    fireEvent.blur(target, { relatedTarget: positionTarget });
    expect(result.current.isVisible).toBe(false);
    fireEvent.mouseEnter(positionTarget);
    expect(result.current.isVisible).toBe(false);
  });

  it('opens and closes the click Hint from the trigger', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    document.body.append(target, hint);
    const { result } = renderHook(() => useHint<HTMLButtonElement>({ visibilityTrigger: 'click' }));

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.hintProps.ref(hint);
    });

    expect(result.current.hintProps.showCloseIcon).toBe(true);
    expect(result.current.triggerProps['aria-expanded']).toBe(false);
    fireEvent.click(target);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.triggerProps['aria-expanded']).toBe(true);
    expect(result.current.triggerProps['aria-describedby']).toBe(result.current.hintProps.id);
    fireEvent.click(target);
    expect(result.current.isVisible).toBe(false);
  });

  it.each(['Enter', ' '])('opens the click Hint with the %s activation key', (key) => {
    const target = document.createElement('div');
    const { result } = renderHook(() => useHint<HTMLDivElement>({ visibilityTrigger: 'click' }));

    act(() => result.current.triggerProps.ref(target));
    fireEvent.keyDown(target, { key });
    expect(result.current.isVisible).toBe(true);
  });

  it('closes the click Hint from its close callback, on Escape and on an outside click', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const hintChild = document.createElement('button');
    const outside = document.createElement('button');
    hint.append(hintChild);
    document.body.append(target, hint, outside);
    const { result } = renderHook(() => useHint<HTMLButtonElement>({ visibilityTrigger: 'click' }));

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.hintProps.ref(hint);
    });

    fireEvent.click(target);
    fireEvent.click(hintChild);
    expect(result.current.isVisible).toBe(true);
    act(() => result.current.hintProps.onClose?.());
    expect(result.current.isVisible).toBe(false);

    fireEvent.click(target);
    fireEvent.keyDown(hint, { key: 'Escape' });
    expect(result.current.isVisible).toBe(false);

    fireEvent.click(target);
    fireEvent.click(outside);
    expect(result.current.isVisible).toBe(false);
  });

  it('uses a separate positioning element without treating it as part of the click area', () => {
    const target = document.createElement('button');
    const positionTarget = document.createElement('div');
    document.body.append(target, positionTarget);
    const { result } = renderHook(() =>
      useHint<HTMLButtonElement>({ visibilityTrigger: 'click', targetElement: positionTarget }),
    );

    act(() => result.current.triggerProps.ref(target));
    expect(result.current.hintProps.targetElement).toBe(positionTarget);
    fireEvent.click(target);
    fireEvent.click(positionTarget);
    expect(result.current.isVisible).toBe(false);
  });
});
