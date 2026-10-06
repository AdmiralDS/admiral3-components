import { createRef } from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PositionedPortal } from './PositionedPortal';
import type { Rect } from '../../../utils/observeRect';

const observerMock = vi.hoisted(() => ({
  callback: undefined as ((rect: Rect) => void) | undefined,
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

vi.mock('../../../utils/observeRect', () => ({
  observeRect: vi.fn((_target: Element, callback: (rect: Rect) => void) => {
    observerMock.callback = callback;
    return observerMock;
  }),
}));

const targetElement = document.createElement('button');
const rect: Rect = {
  bottom: 60,
  height: 40,
  left: 10,
  right: 110,
  top: 20,
  width: 100,
  x: 10,
  y: 20,
  scrollHeight: 40,
  scrollLeft: 0,
  scrollTop: 0,
  scrollWidth: 100,
};

describe('PositionedPortal', () => {
  afterEach(() => {
    cleanup();
    observerMock.callback = undefined;
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders children into the target document body by default', () => {
    render(
      <PositionedPortal targetElement={targetElement} data-testid="portal">
        Content
      </PositionedPortal>,
    );

    expect(screen.getByTestId('portal').parentElement).toBe(targetElement.ownerDocument.body);
  });

  it('renders children into the provided container', () => {
    const container = document.createElement('section');
    document.body.append(container);

    render(
      <PositionedPortal targetElement={targetElement} container={container} data-testid="portal">
        Content
      </PositionedPortal>,
    );

    expect(screen.getByTestId('portal').parentElement).toBe(container);
    container.remove();
  });

  it('forwards the container node ref while retaining its internal positioning ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PositionedPortal ref={ref} targetElement={targetElement} data-testid="portal" />);

    act(() => observerMock.callback?.(rect));

    expect(ref.current).toBe(screen.getByTestId('portal'));
    expect(ref.current).toHaveStyle({ top: '20px', left: '10px', height: '40px', width: '100px' });
  });

  it('uses the full container width when requested', () => {
    render(<PositionedPortal targetElement={targetElement} fullContainerWidth data-testid="portal" />);

    act(() => observerMock.callback?.(rect));

    expect(screen.getByTestId('portal')).toHaveStyle({ left: '0px', width: '100%' });
  });

  it('stops observing the target on unmount', () => {
    const view = render(<PositionedPortal targetElement={targetElement} />);

    expect(observerMock.observe).toHaveBeenCalledOnce();
    view.unmount();
    expect(observerMock.unobserve).toHaveBeenCalledOnce();
  });

  it('does not access document when rendered on the server', () => {
    vi.stubGlobal('document', undefined);

    expect(renderToString(<PositionedPortal targetElement={null}>Content</PositionedPortal>)).toBe('');
  });
});
