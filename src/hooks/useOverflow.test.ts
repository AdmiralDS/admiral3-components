import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useOverflow } from './useOverflow';

type Elements = {
  targetElement: Element | null;
  contentElement: HTMLElement | null;
};

const createContent = (scrollWidth: number) => {
  const content = document.createElement('span');
  Object.defineProperties(content, {
    clientWidth: { configurable: true, value: 100 },
    scrollWidth: { configurable: true, value: scrollWidth },
  });
  return content;
};

const renderOverflow = (targetElement: Element | null, contentElement: HTMLElement | null) =>
  renderHook(({ targetElement, contentElement }: Elements) => useOverflow(targetElement, contentElement), {
    initialProps: { targetElement, contentElement },
  });

describe('useOverflow', () => {
  it('applies vertical tolerance consistently on initial measurement, focus and resize', () => {
    const target = document.createElement('button');
    const content = createContent(80);
    Object.defineProperties(content, {
      clientHeight: { value: 20 },
      scrollHeight: { configurable: true, value: 21 },
    });
    const { result } = renderHook(() => useOverflow(target, content, { observe: true, verticalTolerance: 1 }));
    expect(result.current).toBe(false);
    fireEvent.focus(target);
    expect(result.current).toBe(false);
    Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 40 });
    fireEvent(window, new Event('resize'));
    expect(result.current).toBe(true);
    Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 21 });
    fireEvent.focus(target);
    expect(result.current).toBe(false);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('keeps existing consumers event-driven without allocating resize or font observers', () => {
    const observer = vi.fn();
    vi.stubGlobal('ResizeObserver', observer);
    const target = document.createElement('button');
    const content = createContent(250);
    const measure = vi.fn(() => 250);
    Object.defineProperty(content, 'scrollWidth', { configurable: true, get: measure });
    const { result, rerender } = renderOverflow(target, content);
    expect(measure).not.toHaveBeenCalled();
    fireEvent(window, new Event('resize'));
    rerender({ targetElement: target, contentElement: content });
    expect(result.current).toBe(false);
    expect(measure).not.toHaveBeenCalled();
    expect(observer).not.toHaveBeenCalled();
    fireEvent.focus(target);
    expect(result.current).toBe(true);
    expect(measure).toHaveBeenCalled();
  });

  it('observes replacement content and disconnects obsolete observers', () => {
    const observers: { emit: () => void; observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }[] =
      [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
        constructor(callback: () => void) {
          observers.push({ emit: callback, observe: this.observe, disconnect: this.disconnect });
        }
      },
    );
    const first = createContent(250);
    const second = createContent(80);
    const { result, rerender, unmount } = renderHook(
      ({ contentElement }: { contentElement: HTMLElement | null }) =>
        useOverflow(null, contentElement, { observe: true }),
      { initialProps: { contentElement: first as HTMLElement | null } },
    );
    expect(result.current).toBe(true);
    expect(observers[0].observe).toHaveBeenCalledWith(first);
    rerender({ contentElement: second });
    expect(result.current).toBe(false);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(observers[1].observe).toHaveBeenCalledWith(second);
    act(() => observers[0].emit());
    expect(result.current).toBe(false);
    Object.defineProperty(second, 'scrollWidth', { configurable: true, value: 300 });
    act(() => observers[1].emit());
    expect(result.current).toBe(true);
    rerender({ contentElement: null });
    expect(result.current).toBe(false);
    expect(observers[1].disconnect).toHaveBeenCalledOnce();
    unmount();
  });

  it('remeasures observed content after rerenders and window resizing', () => {
    const content = createContent(80);
    const { result, rerender } = renderHook(
      ({ measurementKey }) => useOverflow(null, content, { observe: true, measurementKey }),
      { initialProps: { measurementKey: 'short' } },
    );
    expect(result.current).toBe(false);
    Object.defineProperty(content, 'scrollWidth', { configurable: true, value: 200 });
    rerender({ measurementKey: 'long' });
    expect(result.current).toBe(true);
    Object.defineProperty(content, 'scrollWidth', { configurable: true, value: 80 });
    fireEvent(window, new Event('resize'));
    expect(result.current).toBe(false);
  });

  it('returns false until a target element is available', () => {
    const contentElement = createContent(250);
    const { result, rerender } = renderOverflow(null, contentElement);
    expect(result.current).toBe(false);

    const targetElement = document.createElement('button');
    rerender({ targetElement, contentElement });
    fireEvent.focus(targetElement);
    expect(result.current).toBe(true);
  });

  it.each(['mouseEnter', 'focus'] as const)('measures and rechecks overflow on %s', (eventName) => {
    const targetElement = document.createElement('button');
    const contentElement = createContent(250);
    const { result } = renderOverflow(targetElement, contentElement);

    expect(result.current).toBe(false);
    fireEvent[eventName](targetElement);
    expect(result.current).toBe(true);

    Object.defineProperty(contentElement, 'scrollWidth', { configurable: true, value: 80 });
    fireEvent[eventName](targetElement);
    expect(result.current).toBe(false);
  });

  it('returns false when the content element is missing', () => {
    const targetElement = document.createElement('button');
    const { result } = renderOverflow(targetElement, null);

    fireEvent.mouseEnter(targetElement);
    fireEvent.focus(targetElement);
    expect(result.current).toBe(false);
  });

  it.each(['mouseEnter', 'focus'] as const)('supports an SVG trigger on %s', (eventName) => {
    const targetElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const { result, unmount } = renderOverflow(targetElement, createContent(250));

    fireEvent[eventName](targetElement);
    expect(result.current).toBe(true);
    unmount();
  });

  it('removes listeners from the previous target when the target changes', () => {
    const previousTarget = document.createElement('button');
    const contentElement = createContent(250);
    const { result, rerender } = renderOverflow(previousTarget, contentElement);
    fireEvent.focus(previousTarget);
    expect(result.current).toBe(true);

    const targetElement = document.createElement('button');
    rerender({ targetElement, contentElement });
    Object.defineProperty(contentElement, 'scrollWidth', { configurable: true, value: 80 });

    fireEvent.mouseEnter(previousTarget);
    fireEvent.focus(previousTarget);
    expect(result.current).toBe(true);
    fireEvent.focus(targetElement);
    expect(result.current).toBe(false);
  });

  it('measures the new content element after it is replaced or removed', () => {
    const targetElement = document.createElement('button');
    const { result, rerender } = renderOverflow(targetElement, createContent(80));
    fireEvent.focus(targetElement);
    expect(result.current).toBe(false);

    rerender({ targetElement, contentElement: createContent(250) });
    fireEvent.mouseEnter(targetElement);
    expect(result.current).toBe(true);

    rerender({ targetElement, contentElement: null });
    fireEvent.focus(targetElement);
    expect(result.current).toBe(false);
  });

  it('does not measure content after unmounting', () => {
    const targetElement = document.createElement('button');
    const contentElement = createContent(250);
    const measure = vi.fn(() => 250);
    Object.defineProperty(contentElement, 'scrollWidth', { configurable: true, get: measure });
    const { unmount } = renderOverflow(targetElement, contentElement);

    unmount();
    fireEvent.mouseEnter(targetElement);
    fireEvent.focus(targetElement);
    expect(measure).not.toHaveBeenCalled();
  });
});
