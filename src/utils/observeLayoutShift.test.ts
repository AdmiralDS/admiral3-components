import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { observeLayoutShift } from './observeLayoutShift';

type Rect = Pick<DOMRect, 'x' | 'y' | 'width' | 'height' | 'top' | 'right' | 'bottom' | 'left' | 'toJSON'>;

const rect = (x = 10, y = 20, width = 30, height = 40): Rect => ({
  x,
  y,
  width,
  height,
  top: y,
  right: x + width,
  bottom: y + height,
  left: x,
  toJSON: () => ({}),
});

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = [];
  readonly observe = vi.fn();
  readonly disconnect = vi.fn();
  readonly options?: IntersectionObserverInit;
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    IntersectionObserverMock.instances.push(this);
  }

  emit(intersectionRatio: number) {
    this.callback([{ intersectionRatio } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe('observeLayoutShift', () => {
  let element: HTMLElement;
  let currentRect: Rect;

  beforeEach(() => {
    IntersectionObserverMock.instances = [];
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    currentRect = rect();
    element = document.createElement('button');
    document.body.append(element);
    vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => currentRect as DOMRect);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('starts observing without notifying about the initial geometry', () => {
    const onChange = vi.fn();
    const cleanup = observeLayoutShift(element, onChange);

    expect(onChange).not.toHaveBeenCalled();
    expect(IntersectionObserverMock.instances).toHaveLength(1);
    expect(IntersectionObserverMock.instances[0].observe).toHaveBeenCalledWith(element);

    cleanup();
  });

  it('notifies and rebuilds the observer when the rect changes', () => {
    const onChange = vi.fn();
    const cleanup = observeLayoutShift(element, onChange);
    const initialObserver = IntersectionObserverMock.instances[0];

    currentRect = rect(100, 200);
    initialObserver.emit(1);

    expect(onChange).toHaveBeenCalledOnce();
    expect(initialObserver.disconnect).toHaveBeenCalledOnce();
    expect(IntersectionObserverMock.instances).toHaveLength(2);

    cleanup();
  });

  it('calibrates an unexpected initial ratio and notifies conservatively', () => {
    const onChange = vi.fn();
    const cleanup = observeLayoutShift(element, onChange);

    IntersectionObserverMock.instances[0].emit(0.5);

    expect(onChange).toHaveBeenCalledOnce();
    expect(IntersectionObserverMock.instances).toHaveLength(2);
    expect(IntersectionObserverMock.instances[1].options?.threshold).toBe(0.5);

    cleanup();
  });

  it('throttles refreshes while the element is fully clipped', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const cleanup = observeLayoutShift(element, onChange);

    IntersectionObserverMock.instances[0].emit(0);
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(999);
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onChange).toHaveBeenCalledOnce();
    expect(IntersectionObserverMock.instances[1].options?.threshold).toBe(1e-7);

    cleanup();
  });

  it('cancels a pending clipped-element refresh during cleanup', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const cleanup = observeLayoutShift(element, onChange);

    IntersectionObserverMock.instances[0].emit(0);
    cleanup();
    vi.runAllTimers();

    expect(onChange).not.toHaveBeenCalled();
    expect(IntersectionObserverMock.instances).toHaveLength(1);
  });

  it('rebuilds the observer on window resize without notifying', () => {
    const onChange = vi.fn();
    const cleanup = observeLayoutShift(element, onChange);
    const initialObserver = IntersectionObserverMock.instances[0];

    window.dispatchEvent(new Event('resize'));

    expect(onChange).not.toHaveBeenCalled();
    expect(initialObserver.disconnect).toHaveBeenCalledOnce();
    expect(IntersectionObserverMock.instances).toHaveLength(2);

    cleanup();
  });

  it('removes the resize listener during cleanup', () => {
    const onChange = vi.fn();
    const cleanup = observeLayoutShift(element, onChange);
    const initialObserver = IntersectionObserverMock.instances[0];
    cleanup();

    window.dispatchEvent(new Event('resize'));
    currentRect = rect(100, 200);
    initialObserver.emit(1);

    expect(IntersectionObserverMock.instances).toHaveLength(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not create an observer for an element with zero size', () => {
    currentRect = rect(10, 20, 0, 0);
    const cleanup = observeLayoutShift(element, vi.fn());

    expect(IntersectionObserverMock.instances).toHaveLength(0);

    cleanup();
  });

  it('returns a safe cleanup when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const onChange = vi.fn();

    const cleanup = observeLayoutShift(element, onChange);

    expect(() => cleanup()).not.toThrow();
    expect(onChange).not.toHaveBeenCalled();
    expect(IntersectionObserverMock.instances).toHaveLength(0);
  });
});
