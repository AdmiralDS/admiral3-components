import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TOOLTIP_DELAY, useTooltip } from './useTooltip';

describe('useTooltip', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('adapts hover interaction props to the public Tooltip contract', () => {
    const target = document.createElement('button');
    const tooltip = document.createElement('div');
    const { result } = renderHook(() => useTooltip<HTMLButtonElement>());

    act(() => {
      result.current.triggerProps.ref(target);
      result.current.tooltipProps.ref(tooltip);
    });

    expect(result.current.tooltipProps.targetElement).toBe(target);
    fireEvent.mouseEnter(target);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.triggerProps['aria-describedby']).toBe(result.current.tooltipProps.id);
  });

  it('uses the design-system delay by request', () => {
    vi.useFakeTimers();
    const target = document.createElement('button');
    const { result } = renderHook(() => useTooltip<HTMLButtonElement>({ delay: TOOLTIP_DELAY }));
    act(() => result.current.triggerProps.ref(target));

    fireEvent.mouseEnter(target);
    expect(result.current.isVisible).toBe(false);
    act(() => vi.advanceTimersByTime(TOOLTIP_DELAY));
    expect(result.current.isVisible).toBe(true);
  });
});
