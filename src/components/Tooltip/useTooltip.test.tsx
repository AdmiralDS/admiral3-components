import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTooltip } from './useTooltip';

describe('useTooltip', () => {
  let target: HTMLButtonElement;
  let tooltip: HTMLDivElement;
  let animationFrameCallback: FrameRequestCallback | undefined;

  beforeEach(() => {
    target = document.createElement('button');
    tooltip = document.createElement('div');
    document.body.append(target, tooltip);
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallback = callback;
        return 42;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => null),
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Reflect.deleteProperty(document, 'elementFromPoint');
  });

  const setup = (openDelay = 0) => {
    const hook = renderHook(() => useTooltip<HTMLButtonElement>({ openDelay }));
    act(() => {
      hook.result.current.targetRef(target);
      hook.result.current.tooltipRef(tooltip);
    });
    return hook;
  };

  it('exposes callback refs and their current elements', () => {
    const { result } = setup();
    expect(result.current.targetElement).toBe(target);
    act(() => result.current.targetRef(null));
    expect(result.current.targetElement).toBeNull();
  });

  it('shows and hides through the imperative callbacks', () => {
    const { result } = setup();
    act(() => result.current.showTooltip());
    expect(result.current.isVisible).toBe(true);
    act(() => result.current.hideTooltip());
    expect(result.current.isVisible).toBe(false);
  });

  it.each(['mouseenter', 'focus'] as const)('shows on target %s', (eventName) => {
    const { result } = setup();
    act(() => target.dispatchEvent(new Event(eventName)));
    expect(result.current.isVisible).toBe(true);
  });

  it('waits for openDelay and restarts the delay when show is requested again', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { result } = setup(500);
    act(() => result.current.showTooltip());
    act(() => vi.advanceTimersByTime(300));
    act(() => result.current.showTooltip());
    act(() => vi.advanceTimersByTime(499));
    expect(result.current.isVisible).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.isVisible).toBe(true);
  });

  it('cancels a delayed opening when hidden or when entering the tooltip', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { result } = setup(500);
    act(() => result.current.showTooltip());
    act(() => result.current.hideTooltip());
    act(() => vi.runAllTimers());
    expect(result.current.isVisible).toBe(false);
    act(() => result.current.showTooltip());
    fireEvent.mouseEnter(tooltip);
    act(() => vi.runAllTimers());
    expect(result.current.isVisible).toBe(false);
  });

  it('stays open while pointer moves between target and tooltip descendants', () => {
    const targetChild = document.createElement('span');
    const tooltipChild = document.createElement('span');
    target.append(targetChild);
    tooltip.append(tooltipChild);
    const { result } = setup();
    act(() => result.current.showTooltip());
    fireEvent.mouseLeave(target, { relatedTarget: tooltipChild });
    expect(result.current.isVisible).toBe(true);
    fireEvent.mouseLeave(tooltip, { relatedTarget: targetChild });
    expect(result.current.isVisible).toBe(true);
  });

  it('hides when pointer or focus leaves both interactive areas', () => {
    const outside = document.createElement('div');
    document.body.append(outside);
    const { result } = setup();
    act(() => result.current.showTooltip());
    fireEvent.mouseLeave(target, { relatedTarget: outside });
    expect(result.current.isVisible).toBe(false);
    act(() => result.current.showTooltip());
    fireEvent.blur(target, { relatedTarget: outside });
    expect(result.current.isVisible).toBe(false);
    act(() => result.current.showTooltip());
    fireEvent.focusOut(tooltip, { relatedTarget: outside });
    expect(result.current.isVisible).toBe(false);
  });

  it('keeps focus transitions between target and tooltip open', () => {
    const { result } = setup();
    act(() => result.current.showTooltip());
    fireEvent.blur(target, { relatedTarget: tooltip });
    fireEvent.focusOut(tooltip, { relatedTarget: target });
    expect(result.current.isVisible).toBe(true);
  });

  it('checks the hovered element on the next frame when relatedTarget is absent', () => {
    const { result } = setup();
    act(() => result.current.showTooltip());
    vi.mocked(document.elementFromPoint).mockReturnValue(tooltip);
    fireEvent.mouseLeave(target, { clientX: 10, clientY: 20, relatedTarget: null });
    act(() => animationFrameCallback?.(0));
    expect(document.elementFromPoint).toHaveBeenCalledWith(10, 20);
    expect(result.current.isVisible).toBe(true);
    vi.mocked(document.elementFromPoint).mockReturnValue(null);
    fireEvent.mouseLeave(target, { clientX: 30, clientY: 40, relatedTarget: null });
    act(() => animationFrameCallback?.(0));
    expect(result.current.isVisible).toBe(false);
  });

  it('cancels an earlier pending pointer check before scheduling another', () => {
    const { result } = setup();
    act(() => result.current.showTooltip());
    fireEvent.mouseLeave(target, { relatedTarget: null });
    fireEvent.mouseLeave(target, { relatedTarget: null });
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it('does not hide during pointer interaction and evaluates position on pointerup', () => {
    const { result } = setup();
    act(() => result.current.showTooltip());
    fireEvent.pointerDown(tooltip);
    fireEvent.mouseLeave(tooltip, { relatedTarget: null });
    fireEvent.blur(target, { relatedTarget: null });
    expect(result.current.isVisible).toBe(true);
    fireEvent.pointerUp(document, { clientX: 5, clientY: 6 });
    expect(result.current.isVisible).toBe(false);
  });

  it.each(['pointerUp', 'pointerCancel'] as const)('stays open after %s inside an interactive area', (eventName) => {
    const { result } = setup();
    act(() => result.current.showTooltip());
    fireEvent.pointerDown(tooltip);
    vi.mocked(document.elementFromPoint).mockReturnValue(target);
    fireEvent[eventName](document);
    expect(result.current.isVisible).toBe(true);
  });

  it('hides a visible tooltip on Escape but ignores other keys', () => {
    const { result } = setup();
    act(() => result.current.showTooltip());
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(result.current.isVisible).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(result.current.isVisible).toBe(false);
  });

  it('removes listeners when refs change', () => {
    const { result } = setup();
    act(() => {
      result.current.targetRef(null);
      result.current.tooltipRef(null);
    });
    fireEvent.mouseEnter(target);
    fireEvent.focusIn(tooltip);
    expect(result.current.isVisible).toBe(false);
  });

  it('cleans up a pending timer and animation frame on unmount', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result, unmount } = setup(500);
    act(() => result.current.showTooltip());
    fireEvent.mouseLeave(target, { relatedTarget: null });
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });
});
