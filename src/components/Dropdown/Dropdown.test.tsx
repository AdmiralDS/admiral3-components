import { createRef, forwardRef } from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Dropdown } from './Dropdown';

vi.mock('../_internal/FloatingPortal', async (importOriginal) => ({
  ...(await importOriginal()),
  FloatingPortal: forwardRef<HTMLDivElement, React.ComponentProps<'div'> & { targetElement: Element | null }>(
    ({ targetElement: _targetElement, ...props }, ref) => <div ref={ref} {...props} />,
  ),
}));

const rect = (left: number, top: number, width: number, height: number): DOMRect =>
  ({
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  }) as DOMRect;

describe('Dropdown', () => {
  let animationFrameCallback: FrameRequestCallback | undefined;

  beforeEach(() => {
    vi.stubGlobal('innerWidth', 800);
    vi.stubGlobal('innerHeight', 600);
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallback = callback;
        return 1;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('notifies once when a visible target becomes detached', () => {
    let targetRect = rect(100, 100, 100, 40);
    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockImplementation(() => targetRect);
    const onTargetDetached = vi.fn();

    render(
      <Dropdown targetElement={targetElement} onTargetDetached={onTargetDetached}>
        Content
      </Dropdown>,
    );
    act(() => animationFrameCallback?.(0));
    expect(onTargetDetached).not.toHaveBeenCalled();

    targetRect = rect(100, -40, 100, 40);
    act(() => window.dispatchEvent(new Event('resize')));
    act(() => animationFrameCallback?.(0));
    expect(onTargetDetached).toHaveBeenCalledOnce();

    act(() => window.dispatchEvent(new Event('resize')));
    act(() => animationFrameCallback?.(0));
    expect(onTargetDetached).toHaveBeenCalledOnce();
  });

  it('does not notify when the target is detached on the initial measurement', () => {
    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue(rect(100, -40, 100, 40));
    const onTargetDetached = vi.fn();

    render(
      <Dropdown targetElement={targetElement} onTargetDetached={onTargetDetached}>
        Content
      </Dropdown>,
    );
    act(() => animationFrameCallback?.(0));

    expect(onTargetDetached).not.toHaveBeenCalled();
  });

  it('applies horizontal and vertical shifts to the dropdown element', () => {
    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue(rect(760, 500, 30, 40));

    render(
      <Dropdown targetElement={targetElement} align="start" data-testid="dropdown">
        Content
      </Dropdown>,
    );
    const dropdown = screen.getByTestId('dropdown');
    vi.spyOn(dropdown, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 200, 500));

    act(() => animationFrameCallback?.(0));

    expect(dropdown).toHaveStyle({ transform: 'translate(-176px, 24px)' });
  });

  it('recalculates the layout when align changes', () => {
    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue(rect(750, 100, 30, 20));

    const { rerender } = render(
      <Dropdown targetElement={targetElement} align="auto" data-testid="dropdown">
        Content
      </Dropdown>,
    );
    const dropdown = screen.getByTestId('dropdown');
    vi.spyOn(dropdown, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 200, 100));

    act(() => animationFrameCallback?.(0));
    expect(dropdown).toHaveStyle({ alignSelf: 'flex-end', transform: 'translate(0px, 0px)' });

    rerender(
      <Dropdown targetElement={targetElement} align="start" data-testid="dropdown">
        Content
      </Dropdown>,
    );
    act(() => animationFrameCallback?.(0));

    expect(dropdown).toHaveStyle({ alignSelf: 'flex-start', transform: 'translate(-166px, 0px)' });
  });

  it('uses content width by default and keeps widthMode out of the DOM', () => {
    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue(rect(100, 100, 120, 40));

    render(
      <Dropdown targetElement={targetElement} data-testid="dropdown">
        Content
      </Dropdown>,
    );

    expect(screen.getByTestId('dropdown')).toHaveStyle({ width: 'max-content' });
    expect(screen.getByTestId('dropdown')).not.toHaveAttribute('widthMode');
  });

  it('updates the width policy when widthMode changes', () => {
    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue(rect(100, 100, 120, 40));
    const { rerender } = render(
      <Dropdown targetElement={targetElement} widthMode="content" data-testid="dropdown">
        Content
      </Dropdown>,
    );

    const dropdown = screen.getByTestId('dropdown');
    expect(dropdown).toHaveStyle({ width: 'max-content' });

    rerender(
      <Dropdown targetElement={targetElement} widthMode="target" data-testid="dropdown">
        Content
      </Dropdown>,
    );

    expect(dropdown).toHaveStyle({ width: 'var(--admiral-floating-target-width)' });
    expect(dropdown).not.toHaveAttribute('widthMode');
  });

  it('forwards the ref and native div attributes to the dropdown element', () => {
    const targetElement = document.createElement('button');
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue(rect(100, 100, 120, 40));
    const ref = createRef<HTMLDivElement>();

    render(
      <Dropdown
        ref={ref}
        targetElement={targetElement}
        className="custom-dropdown"
        style={{ color: 'rgb(255, 0, 0)' }}
        data-component="dropdown"
        data-testid="dropdown"
      >
        Content
      </Dropdown>,
    );

    const dropdown = screen.getByTestId('dropdown');
    expect(ref.current).toBe(dropdown);
    expect(dropdown).toHaveClass('custom-dropdown');
    expect(dropdown).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(dropdown).toHaveAttribute('data-component', 'dropdown');
  });
});
