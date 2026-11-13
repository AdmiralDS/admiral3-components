import { cleanup, fireEvent, renderHook } from '@testing-library/react';
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
  afterEach(cleanup);

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
