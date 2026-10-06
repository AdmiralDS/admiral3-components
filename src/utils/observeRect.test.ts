import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { observeRect } from './observeRect';

// JSDOM не рассчитывает геометрию, поэтому getBoundingClientRect() мокается.
const DEFAULT_RECT: DOMRect = {
  bottom: 30,
  height: 20,
  left: 10,
  right: 50,
  top: 10,
  width: 40,
  x: 10,
  y: 10,
  toJSON: () => ({}),
};

describe('observeRect', () => {
  // Управляемая очередь RAF делает выполнение кадров синхронным и детерминированным.
  let animationFrameCallbacks: Map<number, FrameRequestCallback>;
  let nextAnimationFrameId: number;

  const runNextAnimationFrame = () => {
    const nextFrame = animationFrameCallbacks.entries().next().value;

    if (!nextFrame) throw new Error('No animation frame was scheduled');

    const [id, callback] = nextFrame;
    animationFrameCallbacks.delete(id);
    callback(0);
  };

  beforeEach(() => {
    animationFrameCallbacks = new Map();
    // ID 0 проверяет использование явного сравнения с undefined.
    nextAnimationFrameId = 0;

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        const id = nextAnimationFrameId++;
        animationFrameCallbacks.set(id, callback);
        return id;
      }),
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id: number) => {
        animationFrameCallbacks.delete(id);
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reports the initial rect and only reports subsequent changes', () => {
    const node = document.createElement('div');
    let rect = DEFAULT_RECT;
    vi.spyOn(node, 'getBoundingClientRect').mockImplementation(() => rect);
    const callback = vi.fn();
    const observer = observeRect(node, callback);

    observer.observe();
    runNextAnimationFrame();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(expect.objectContaining({ width: 40, x: 10 }));

    runNextAnimationFrame();
    expect(callback).toHaveBeenCalledTimes(1);

    rect = { ...DEFAULT_RECT, right: 60, width: 50 };
    runNextAnimationFrame();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(expect.objectContaining({ width: 50 }));
  });

  it('does not start another RAF cycle when observe is called repeatedly', () => {
    const node = document.createElement('div');
    vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(DEFAULT_RECT);
    const observer = observeRect(node, vi.fn());

    observer.observe();
    observer.observe();
    observer.observe();

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(animationFrameCallbacks).toHaveLength(1);
  });

  it('cancels the scheduled frame and stops observing', () => {
    const node = document.createElement('div');
    vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(DEFAULT_RECT);
    const callback = vi.fn();
    const observer = observeRect(node, callback);

    observer.observe();
    observer.unobserve();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(0);
    expect(animationFrameCallbacks).toHaveLength(0);
    expect(callback).not.toHaveBeenCalled();
  });

  it('does not schedule another frame when the callback stops observing', () => {
    const node = document.createElement('div');
    vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(DEFAULT_RECT);
    const callback = vi.fn(stopObserving);
    const observer = observeRect(node, callback);

    function stopObserving() {
      observer.unobserve();
    }

    observer.observe();
    runNextAnimationFrame();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(animationFrameCallbacks).toHaveLength(0);
  });

  it('schedules only one frame when the callback restarts observing', () => {
    const node = document.createElement('div');
    vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(DEFAULT_RECT);
    const callback = vi.fn(restartObserving);
    const observer = observeRect(node, callback);

    function restartObserving() {
      observer.unobserve();
      observer.observe();
    }

    observer.observe();
    runNextAnimationFrame();

    // Перезапуск из callback не должен создавать две параллельные RAF-цепочки.
    expect(callback).toHaveBeenCalledTimes(1);
    expect(animationFrameCallbacks).toHaveLength(1);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  });
});
