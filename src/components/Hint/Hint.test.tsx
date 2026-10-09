import { createRef, forwardRef } from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HINT_DIMENSIONS, HINT_DIMENSION_PARAMETERS } from './constants';
import { Hint } from './Hint';
import type * as FloatingPortalModule from '../_internal/FloatingPortal';
import { getTooltipDirection } from '../Tooltip/getTooltipDirection';

vi.mock('../_internal/FloatingPortal', async (importOriginal) => ({
  ...(await importOriginal<typeof FloatingPortalModule>()),
  FloatingPortal: forwardRef<HTMLDivElement, React.ComponentProps<'div'> & { targetElement: Element | null }>(
    ({ targetElement: _targetElement, ...props }, ref) => <div ref={ref} {...props} />,
  ),
}));
vi.mock('../Tooltip/getTooltipDirection', () => ({ getTooltipDirection: vi.fn(() => 'bottom') }));

const targetElement = document.createElement('button');

describe('Hint', () => {
  let animationFrameCallback: FrameRequestCallback | undefined;

  beforeEach(() => {
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
    vi.clearAllMocks();
  });

  it('renders children in an accessible tooltip', () => {
    render(<Hint targetElement={targetElement}>Content</Hint>);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Content');
  });

  it('forwards attributes to the Hint and ref to its interactive wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Hint ref={ref} targetElement={targetElement} data-testid="hint" title="Hint">
        Content
      </Hint>,
    );
    expect(screen.getByTestId('hint')).toHaveAttribute('title', 'Hint');
    expect(ref.current).toBe(screen.getByTestId('hint').parentElement);
  });

  it.each(HINT_DIMENSIONS)('applies the %s dimension', (dimension) => {
    render(
      <Hint targetElement={targetElement} data-testid="hint" dimension={dimension}>
        Content
      </Hint>,
    );
    expect(screen.getByTestId('hint')).toHaveStyle({
      minHeight: `${HINT_DIMENSION_PARAMETERS[dimension].minHeight}px`,
    });
    expect(screen.getByTestId('hint')).toHaveAttribute('data-dimension', dimension);
  });

  it('calculates direction with the shared tooltip algorithm', () => {
    render(
      <Hint targetElement={targetElement} hintPosition="right">
        Content
      </Hint>,
    );
    act(() => animationFrameCallback?.(0));
    expect(getTooltipDirection).toHaveBeenCalledWith(
      targetElement,
      expect.objectContaining({ width: 0, height: 0 }),
      expect.any(HTMLDivElement),
      'right',
    );
  });

  it('renders nothing without content or target', () => {
    const { rerender } = render(<Hint targetElement={targetElement} />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    rerender(<Hint targetElement={null}>Content</Hint>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
