import { createRef, forwardRef } from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TOOLTIP_DIMENSIONS, TOOLTIP_DIMENSION_PARAMETERS } from './constants';
import { getTooltipDirection } from './getTooltipDirection';
import { Tooltip } from './Tooltip';
import type { TooltipInternalPosition } from './types';

vi.mock('../../utils/getScrollbarSize', () => ({ getScrollbarSize: () => 16 }));

vi.mock('../_internal/PositionedPortal', () => ({
  PositionedPortal: forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & { targetElement: Element | null; fullContainerWidth?: boolean }
  >(({ targetElement: _targetElement, fullContainerWidth, ...props }, ref) => (
    <div ref={ref} data-full-container-width={String(Boolean(fullContainerWidth))} {...props} />
  )),
}));

vi.mock('./getTooltipDirection', () => ({ getTooltipDirection: vi.fn(() => 'bottom') }));

class ResizeObserverMock implements ResizeObserver {
  static instances: ResizeObserverMock[] = [];
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }

  emit(height: number) {
    this.callback([{ contentRect: { height } } as ResizeObserverEntry], this);
  }
}

const targetElement = document.createElement('button');
type TooltipTestProps = Partial<React.ComponentProps<typeof Tooltip>> & { 'data-testid'?: string };
const renderTooltip = (props: TooltipTestProps = {}) =>
  render(<Tooltip targetElement={targetElement} renderContent={() => 'Content'} {...props} />);

describe('Tooltip', () => {
  let animationFrameCallback: FrameRequestCallback | undefined;

  beforeEach(() => {
    ResizeObserverMock.instances = [];
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallback = callback;
        return 1;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.mocked(getTooltipDirection).mockReturnValue('bottom');
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders content returned by renderContent in an accessible tooltip', () => {
    renderTooltip();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Content');
  });

  it.each([
    ['', 'empty string'],
    [undefined, 'undefined'],
    [null, 'null'],
    [false, 'false'],
  ])('renders nothing for %s content', (content, _description) => {
    render(<Tooltip targetElement={targetElement} renderContent={() => content} />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it.each([0, <span key="node">Node content</span>])('renders valid falsy or React node content', (content) => {
    render(<Tooltip targetElement={targetElement} renderContent={() => content} />);
    expect(screen.getByRole('tooltip')).toHaveTextContent(content === 0 ? '0' : 'Node content');
  });

  it('forwards HTML attributes to the tooltip container', () => {
    renderTooltip({ 'data-testid': 'tooltip', title: 'Tooltip title', className: 'custom-class' });
    expect(screen.getByTestId('tooltip')).toHaveAttribute('title', 'Tooltip title');
    expect(screen.getByTestId('tooltip')).toHaveClass('custom-class');
  });

  it('forwards ref to the interactive outer wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    renderTooltip({ ref, 'data-testid': 'tooltip' });
    expect(ref.current).toBe(screen.getByTestId('tooltip').parentElement);
  });

  it.each(TOOLTIP_DIMENSIONS)('applies the %s dimension without forwarding internal props', (dimension) => {
    renderTooltip({ dimension, 'data-testid': 'tooltip' });
    expect(screen.getByTestId('tooltip')).toHaveAttribute('data-dimension', dimension);
    expect(screen.getByTestId('tooltip')).toHaveStyle({
      minHeight: `${TOOLTIP_DIMENSION_PARAMETERS[dimension].minHeight}px`,
      padding: TOOLTIP_DIMENSION_PARAMETERS[dimension].padding,
    });
    expect(screen.getByTestId('tooltip')).not.toHaveAttribute('dimension');
  });

  it('uses the medium dimension by default', () => {
    renderTooltip({ 'data-testid': 'tooltip' });
    expect(screen.getByTestId('tooltip')).toHaveAttribute('data-dimension', 'm');
  });

  it('calculates direction on the next animation frame and cancels it on unmount', () => {
    const { unmount } = renderTooltip({ tooltipPosition: 'right' });
    expect(getTooltipDirection).not.toHaveBeenCalled();
    act(() => animationFrameCallback?.(0));
    expect(getTooltipDirection).toHaveBeenCalledWith(targetElement, expect.any(HTMLDivElement), 16, 'right');
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it.each<[TooltipInternalPosition, string, string, boolean]>([
    ['leftBottom', 'row-reverse', 'flex-start', false],
    ['leftTop', 'row-reverse', 'flex-end', false],
    ['left', 'row-reverse', 'center', false],
    ['rightBottom', 'row', 'flex-start', false],
    ['rightTop', 'row', 'flex-end', false],
    ['right', 'row', 'center', false],
    ['topPageCenter', 'column-reverse', 'center', true],
    ['topLeft', 'column-reverse', 'flex-end', false],
    ['topRight', 'column-reverse', 'flex-start', false],
    ['top', 'column-reverse', 'center', false],
    ['bottomPageCenter', 'column', 'center', true],
    ['bottomLeft', 'column', 'flex-end', false],
    ['bottomRight', 'column', 'flex-start', false],
    ['bottom', 'column', 'center', false],
  ])('applies layout for the %s direction', (direction, flexDirection, alignSelf, fullWidth) => {
    vi.mocked(getTooltipDirection).mockReturnValue(direction);
    renderTooltip({ 'data-testid': 'tooltip' });
    act(() => animationFrameCallback?.(0));
    const wrapper = screen.getByTestId('tooltip').parentElement!;
    expect(wrapper).toHaveStyle({ alignSelf });
    expect(wrapper.parentElement).toHaveStyle({ flexDirection });
    expect(wrapper.parentElement).toHaveAttribute('data-full-container-width', String(fullWidth));
  });

  it('makes the wrapper visible after mount', () => {
    renderTooltip({ 'data-testid': 'tooltip' });
    expect(screen.getByTestId('tooltip').parentElement).toHaveStyle({ opacity: '1' });
  });

  it('observes size, recalculates only after a height change, and disconnects on unmount', () => {
    const { unmount } = renderTooltip();
    const observer = ResizeObserverMock.instances[0];
    expect(observer.observe).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    act(() => observer.emit(20));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    act(() => observer.emit(20));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    act(() => observer.emit(30));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });
});
