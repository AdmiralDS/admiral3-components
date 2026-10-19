import { useState } from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useFloating } from './useFloating';

describe('useFloating', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('synchronizes the floating container with the target rect', () => {
    let animationFrameCallback: FrameRequestCallback | undefined;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallback = callback;
        return 1;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      x: 20,
      y: 30,
      width: 100,
      height: 40,
      top: 30,
      right: 120,
      bottom: 70,
      left: 20,
      toJSON: () => undefined,
    });
    const TestComponent = () => {
      const [floatingPortal, setFloatingPortal] = useState<HTMLDivElement | null>(null);
      const [floatingElement, setFloatingElement] = useState<HTMLDivElement | null>(null);
      useFloating({ targetElement, floatingPortal, floatingElement });
      return (
        <div ref={setFloatingPortal} data-testid="portal">
          <div ref={setFloatingElement} />
        </div>
      );
    };

    render(<TestComponent />);
    act(() => animationFrameCallback?.(0));

    const floatingPortal = screen.getByTestId('portal');
    expect(floatingPortal).toHaveStyle({
      top: '30px',
      left: '20px',
      height: '40px',
      width: '100px',
    });
  });

  it('passes the synchronized elements and target rect to onUpdate', () => {
    let animationFrameCallback: FrameRequestCallback | undefined;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallback = callback;
        return 1;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      x: 20,
      y: 30,
      width: 100,
      height: 40,
      top: 30,
      right: 120,
      bottom: 70,
      left: 20,
      toJSON: () => undefined,
    });
    const onUpdate = vi.fn();
    const TestComponent = () => {
      const [floatingPortal, setFloatingPortal] = useState<HTMLDivElement | null>(null);
      const [floatingElement, setFloatingElement] = useState<HTMLDivElement | null>(null);
      useFloating({ targetElement, floatingPortal, floatingElement, onUpdate });
      return (
        <div ref={setFloatingPortal}>
          <div ref={setFloatingElement} />
        </div>
      );
    };

    render(<TestComponent />);
    act(() => animationFrameCallback?.(0));

    expect(onUpdate).toHaveBeenCalledWith({
      floatingElement: expect.any(HTMLDivElement),
      floatingPortal: expect.any(HTMLDivElement),
      targetRect: expect.objectContaining({ x: 20, y: 30, width: 100, height: 40 }),
    });
  });

  it('calls onUpdate after synchronizing the container', () => {
    let animationFrameCallback: FrameRequestCallback | undefined;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallback = callback;
        return 1;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const targetElement = document.createElement('button');
    const onUpdate = vi.fn();
    const TestComponent = () => {
      const [floatingPortal, setFloatingPortal] = useState<HTMLDivElement | null>(null);
      const [floatingElement, setFloatingElement] = useState<HTMLDivElement | null>(null);
      useFloating({ targetElement, floatingPortal, floatingElement, onUpdate });
      return (
        <div ref={setFloatingPortal}>
          <div ref={setFloatingElement} />
        </div>
      );
    };

    render(<TestComponent />);
    act(() => animationFrameCallback?.(0));

    expect(onUpdate).toHaveBeenCalledOnce();
  });
});
