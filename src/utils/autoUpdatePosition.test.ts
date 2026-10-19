import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { autoUpdatePosition } from './autoUpdatePosition';

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];
  readonly observe = vi.fn();
  readonly disconnect = vi.fn();
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }

  emit() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

class IntersectionObserverMock {
  readonly observe = vi.fn();
  readonly disconnect = vi.fn();
}

describe('autoUpdatePosition', () => {
  let frames: Map<number, FrameRequestCallback>;
  let nextFrameId: number;

  const runFrame = () => {
    const entry = frames.entries().next().value;
    if (!entry) throw new Error('No animation frame was scheduled');
    const [id, callback] = entry;
    frames.delete(id);
    callback(0);
  };

  beforeEach(() => {
    frames = new Map();
    nextFrameId = 1;
    ResizeObserverMock.instances = [];
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        const id = nextFrameId++;
        frames.set(id, callback);
        return id;
      }),
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id: number) => {
        frames.delete(id);
      }),
    );
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const setup = () => {
    const ancestor = document.createElement('div');
    const targetElement = document.createElement('button');
    const floating = document.createElement('div');
    ancestor.style.overflow = 'auto';
    ancestor.append(targetElement, floating);
    document.body.append(ancestor);
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      x: 10,
      y: 20,
      width: 30,
      height: 40,
      top: 20,
      right: 40,
      bottom: 60,
      left: 10,
      toJSON: () => ({}),
    });
    return { ancestor, targetElement, floating };
  };

  it('schedules an initial update and observes both elements', () => {
    const { targetElement, floating } = setup();
    const update = vi.fn();
    const cleanup = autoUpdatePosition(targetElement, floating, update);

    expect(ResizeObserverMock.instances[0].observe).toHaveBeenCalledWith(targetElement);
    expect(ResizeObserverMock.instances[0].observe).toHaveBeenCalledWith(floating);
    expect(update).not.toHaveBeenCalled();
    runFrame();
    expect(update).toHaveBeenCalledOnce();
    cleanup();
  });

  it('coalesces scroll, resize and ResizeObserver signals', () => {
    const { ancestor, targetElement, floating } = setup();
    const update = vi.fn();
    const cleanup = autoUpdatePosition(targetElement, floating, update);
    runFrame();

    ancestor.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    ResizeObserverMock.instances[0].emit();

    expect(frames).toHaveLength(1);
    runFrame();
    expect(update).toHaveBeenCalledTimes(2);
    cleanup();
  });

  it('observes element ancestors when elementResize is disabled', () => {
    const { ancestor, targetElement, floating } = setup();
    const cleanup = autoUpdatePosition(targetElement, floating, vi.fn(), { elementResize: false });
    const observer = ResizeObserverMock.instances[0];

    expect(observer.observe).toHaveBeenCalledOnce();
    expect(observer.observe).toHaveBeenCalledWith(ancestor);
    expect(observer.observe).not.toHaveBeenCalledWith(targetElement);
    expect(observer.observe).not.toHaveBeenCalledWith(floating);
    cleanup();
  });

  it('observes target and floating elements when ancestorResize is disabled', () => {
    const { ancestor, targetElement, floating } = setup();
    const cleanup = autoUpdatePosition(targetElement, floating, vi.fn(), { ancestorResize: false });
    const observer = ResizeObserverMock.instances[0];

    expect(observer.observe).toHaveBeenCalledTimes(2);
    expect(observer.observe).toHaveBeenCalledWith(targetElement);
    expect(observer.observe).toHaveBeenCalledWith(floating);
    expect(observer.observe).not.toHaveBeenCalledWith(ancestor);
    cleanup();
  });

  it('removes listeners, observers and a pending frame', () => {
    const { ancestor, targetElement, floating } = setup();
    const update = vi.fn();
    const cleanup = autoUpdatePosition(targetElement, floating, update);

    cleanup();
    expect(frames).toHaveLength(0);
    expect(ResizeObserverMock.instances[0].disconnect).toHaveBeenCalledOnce();

    ancestor.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    expect(frames).toHaveLength(0);
  });
});
