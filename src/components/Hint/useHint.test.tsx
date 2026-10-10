import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useHint } from './useHint';

describe('useHint', () => {
  afterEach(cleanup);

  it('uses hover interaction by default and adapts its props to hintProps', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const { result } = renderHook(() => useHint<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.hintProps.ref(hint);
    });

    fireEvent.mouseEnter(target);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.triggerProps['aria-describedby']).toBe(result.current.hintProps.id);
    expect(result.current.hintProps.targetElement).toBe(target);
  });

  it('uses click interaction when requested and adapts its props to hintProps', () => {
    const target = document.createElement('button');
    const hint = document.createElement('div');
    const { result } = renderHook(() => useHint<HTMLButtonElement>({ triggerMode: 'click' }));

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.hintProps.ref(hint);
    });

    fireEvent.click(target);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.triggerProps['aria-controls']).toBe(result.current.hintProps.id);
    expect(result.current.triggerProps['aria-haspopup']).toBe('dialog');
    expect(result.current.hintProps.role).toBe('dialog');
    expect(result.current.hintProps['aria-labelledby']).toBe(result.current.triggerProps.id);
  });
});
