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
});
