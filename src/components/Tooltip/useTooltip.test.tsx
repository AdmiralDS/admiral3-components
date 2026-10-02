import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TOOLTIP_DELAY, useTooltip } from './useTooltip';

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

  const setup = (delay = 0) => {
    const hook = renderHook(() => useTooltip<HTMLButtonElement>({ delay }));
    act(() => {
      hook.result.current.targetProps.ref(target);
      hook.result.current.tooltipProps.ref(tooltip);
    });
    return hook;
  };

  it('provides the target element to the tooltip props', () => {
    const { result } = setup();
    expect(result.current.tooltipProps.targetElement).toBe(target);
    act(() => result.current.targetProps.ref(null));
    expect(result.current.tooltipProps.targetElement).toBeNull();
  });

  it('provides linked accessibility props for the target and tooltip', () => {
    const { result } = setup();
    expect(result.current.tooltipProps.id).toBeTruthy();
    expect(result.current.targetProps['aria-describedby']).toBeUndefined();
    fireEvent.mouseEnter(target);
    expect(result.current.targetProps['aria-describedby']).toBe(result.current.tooltipProps.id);
    fireEvent.mouseLeave(target, { relatedTarget: document.body });
    expect(result.current.targetProps['aria-describedby']).toBeUndefined();
  });

  it.each(['mouseenter', 'focus'] as const)('shows on target %s', (eventName) => {
    const { result } = setup();
    act(() => target.dispatchEvent(new Event(eventName)));
    expect(result.current.isVisible).toBe(true);
  });

  it('waits for the design-system delay and restarts it when hover is requested again', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { result } = setup(TOOLTIP_DELAY);
    fireEvent.mouseEnter(target);
    act(() => vi.advanceTimersByTime(300));
    act(() => target.dispatchEvent(new Event('mouseenter')));
    act(() => vi.advanceTimersByTime(TOOLTIP_DELAY - 1));
    expect(result.current.isVisible).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.isVisible).toBe(true);
  });

  it('shows immediately on focus even when hover delay is enabled', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { result } = setup(TOOLTIP_DELAY);
    fireEvent.focus(target);
    expect(result.current.isVisible).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels a delayed opening when hidden or when entering the tooltip', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { result } = setup(TOOLTIP_DELAY);
    fireEvent.mouseEnter(target);
    fireEvent.mouseLeave(target, { relatedTarget: document.body });
    act(() => vi.runAllTimers());
    expect(result.current.isVisible).toBe(false);
    fireEvent.mouseEnter(target);
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
    fireEvent.mouseEnter(target);
    fireEvent.mouseLeave(target, { relatedTarget: tooltipChild });
    expect(result.current.isVisible).toBe(true);
    fireEvent.mouseLeave(tooltip, { relatedTarget: targetChild });
    expect(result.current.isVisible).toBe(true);
  });

  it('hides when pointer or focus leaves both interactive areas', () => {
    const outside = document.createElement('div');
    document.body.append(outside);
    const { result } = setup();
    fireEvent.mouseEnter(target);
    fireEvent.mouseLeave(target, { relatedTarget: outside });
    expect(result.current.isVisible).toBe(false);
    fireEvent.mouseEnter(target);
    fireEvent.blur(target, { relatedTarget: outside });
    expect(result.current.isVisible).toBe(false);
    fireEvent.mouseEnter(target);
    fireEvent.focusOut(tooltip, { relatedTarget: outside });
    expect(result.current.isVisible).toBe(false);
  });

  it('keeps focus transitions between target and tooltip open', () => {
    const { result } = setup();
    fireEvent.mouseEnter(target);
    fireEvent.blur(target, { relatedTarget: tooltip });
    fireEvent.focusOut(tooltip, { relatedTarget: target });
    expect(result.current.isVisible).toBe(true);
  });

  it('checks the hovered element on the next frame when relatedTarget is absent', () => {
    const { result } = setup();
    fireEvent.mouseEnter(target);
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
    setup();
    fireEvent.mouseEnter(target);
    fireEvent.mouseLeave(target, { relatedTarget: null });
    fireEvent.mouseLeave(target, { relatedTarget: null });
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it('does not hide during pointer interaction and evaluates position on pointerup', () => {
    const { result } = setup();
    fireEvent.mouseEnter(target);
    fireEvent.pointerDown(tooltip);
    fireEvent.mouseLeave(tooltip, { relatedTarget: null });
    fireEvent.blur(target, { relatedTarget: null });
    expect(result.current.isVisible).toBe(true);
    fireEvent.pointerUp(document, { clientX: 5, clientY: 6 });
    expect(result.current.isVisible).toBe(false);
  });

  it.each(['pointerUp', 'pointerCancel'] as const)('stays open after %s inside an interactive area', (eventName) => {
    const { result } = setup();
    fireEvent.mouseEnter(target);
    fireEvent.pointerDown(tooltip);
    vi.mocked(document.elementFromPoint).mockReturnValue(target);
    fireEvent[eventName](document);
    expect(result.current.isVisible).toBe(true);
  });

  it('hides a visible tooltip on Escape but ignores other keys', () => {
    const { result } = setup();
    fireEvent.mouseEnter(target);
    fireEvent.keyDown(target, { key: 'Enter' });
    expect(result.current.isVisible).toBe(true);
    fireEvent.keyDown(target, { key: 'Escape' });
    expect(result.current.isVisible).toBe(false);
  });

  it('hides on Escape when the target stops event propagation', () => {
    const { result } = setup();
    target.addEventListener('keydown', (event) => event.stopPropagation());
    fireEvent.focus(target);

    fireEvent.keyDown(target, { key: 'Escape' });

    expect(result.current.isVisible).toBe(false);
  });

  it('cancels delayed opening on Escape', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { result } = setup(TOOLTIP_DELAY);
    fireEvent.mouseEnter(target);

    fireEvent.keyDown(target, { key: 'Escape' });
    act(() => vi.runAllTimers());

    expect(result.current.isVisible).toBe(false);
  });

  it('listens for dismissal events in the target owner document', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument!;
    target = ownerDocument.createElement('button');
    tooltip = ownerDocument.createElement('div');
    ownerDocument.body.append(target, tooltip);
    const { result } = setup();

    fireEvent.focus(target);
    expect(result.current.isVisible).toBe(true);
    fireEvent.keyDown(target, { key: 'Escape' });
    expect(result.current.isVisible).toBe(false);
    iframe.remove();
  });

  it('removes listeners when refs change', () => {
    const { result } = setup();
    act(() => {
      result.current.targetProps.ref(null);
      result.current.tooltipProps.ref(null);
    });
    fireEvent.mouseEnter(target);
    fireEvent.focusIn(tooltip);
    expect(result.current.isVisible).toBe(false);
  });

  it('cleans up a pending timer and animation frame on unmount', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = setup(TOOLTIP_DELAY);
    fireEvent.mouseEnter(target);
    fireEvent.mouseLeave(target, { relatedTarget: null });
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });
});
