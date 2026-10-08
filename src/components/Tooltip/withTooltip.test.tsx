import { createRef, forwardRef, type ComponentRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { css } from 'styled-components';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { TOOLTIP_DELAY } from './useTooltip';
import { withTooltip } from './withTooltip';

const Target = forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>((props, ref) => (
  <button ref={ref} type="button" {...props} />
));
const TargetWithTooltip = withTooltip(Target);

describe('withTooltip', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders the wrapped component and forwards its props and ref to the root element', () => {
    expectTypeOf<ComponentRef<typeof TargetWithTooltip>>().toEqualTypeOf<HTMLButtonElement>();
    const ref = createRef<HTMLButtonElement>();

    render(
      <TargetWithTooltip ref={ref} renderContent={() => 'Tooltip content'} data-testid="target" disabled>
        Target content
      </TargetWithTooltip>,
    );

    const target = screen.getByTestId('target');
    expect(target).toHaveTextContent('Target content');
    expect(target).toBeDisabled();
    expect(ref.current).toBe(target);
  });

  it('opens on hover and closes when the pointer leaves the target and tooltip', () => {
    render(<TargetWithTooltip renderContent={() => 'Tooltip content'}>Target</TargetWithTooltip>);
    const target = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.mouseEnter(target);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip content');
    fireEvent.mouseLeave(target, { relatedTarget: document.body });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens immediately on focus even when hover delay is enabled', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    render(
      <TargetWithTooltip renderContent={() => 'Tooltip content'} withDelay>
        Target
      </TargetWithTooltip>,
    );

    fireEvent.focus(screen.getByRole('button'));

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('uses the recommended delay when opening on hover', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    render(
      <TargetWithTooltip renderContent={() => 'Tooltip content'} withDelay>
        Target
      </TargetWithTooltip>,
    );
    const target = screen.getByRole('button');

    fireEvent.mouseEnter(target);
    act(() => vi.advanceTimersByTime(TOOLTIP_DELAY - 1));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('preserves the target aria-describedby and links it to the visible tooltip', () => {
    render(
      <TargetWithTooltip renderContent={() => 'Tooltip content'} aria-describedby="existing-description">
        Target
      </TargetWithTooltip>,
    );
    const target = screen.getByRole('button');

    expect(target).toHaveAttribute('aria-describedby', 'existing-description');
    fireEvent.mouseEnter(target);

    const tooltip = screen.getByRole('tooltip');
    expect(target.getAttribute('aria-describedby')?.split(' ')).toEqual(['existing-description', tooltip.id]);
  });

  it.each([
    ['', 'empty string'],
    [undefined, 'undefined'],
    [null, 'null'],
    [false, 'false'],
    [true, 'true'],
  ])('does not render a tooltip for %s content', (content, _description) => {
    render(<TargetWithTooltip renderContent={() => content}>Target</TargetWithTooltip>);
    const target = screen.getByRole('button');

    fireEvent.mouseEnter(target);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(target).not.toHaveAttribute('aria-describedby');
  });

  it('renders zero as valid tooltip content', () => {
    render(<TargetWithTooltip renderContent={() => 0}>Target</TargetWithTooltip>);

    fireEvent.mouseEnter(screen.getByRole('button'));

    expect(screen.getByRole('tooltip')).toHaveTextContent('0');
  });

  it('forwards the tooltip ref, dimension and style configuration', () => {
    const tooltipRef = createRef<HTMLDivElement>();
    render(
      <TargetWithTooltip
        renderContent={() => 'Tooltip content'}
        tooltipRef={tooltipRef}
        tooltipDimension="s"
        tooltipStyles={{
          className: 'custom-tooltip',
          style: { maxWidth: '200px' },
          cssMixin: css`
            color: rgb(1, 2, 3);
          `,
        }}
      >
        Target
      </TargetWithTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-dimension', 's');
    expect(tooltip).toHaveClass('custom-tooltip');
    expect(tooltip).toHaveStyle({ maxWidth: '200px', color: 'rgb(1, 2, 3)' });
    expect(tooltipRef.current).toBe(tooltip.parentElement);
  });
});
