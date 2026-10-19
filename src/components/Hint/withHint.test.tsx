import { createRef, forwardRef, type ComponentRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { css } from 'styled-components';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { HINT_DELAY } from './useHint';
import { withHint } from './withHint';

const Target = forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>((props, ref) => (
  <button ref={ref} type="button" {...props} />
));
const TargetWithHint = withHint(Target);

describe('withHint', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders the wrapped component and forwards its props and ref to the root element', () => {
    expectTypeOf<ComponentRef<typeof TargetWithHint>>().toEqualTypeOf<HTMLButtonElement>();
    const ref = createRef<HTMLButtonElement>();

    render(
      <TargetWithHint ref={ref} renderContent={() => 'Hint content'} data-testid="target" disabled>
        Target content
      </TargetWithHint>,
    );

    const target = screen.getByTestId('target');
    expect(target).toHaveTextContent('Target content');
    expect(target).toBeDisabled();
    expect(ref.current).toBe(target);
  });

  it('opens on hover and preserves the target aria-describedby', () => {
    render(
      <TargetWithHint renderContent={() => 'Hint content'} aria-describedby="existing-description">
        Target
      </TargetWithHint>,
    );
    const target = screen.getByRole('button');

    expect(target).toHaveAttribute('aria-describedby', 'existing-description');
    fireEvent.mouseEnter(target);

    const hint = screen.getByRole('tooltip');
    expect(hint).toHaveTextContent('Hint content');
    expect(target.getAttribute('aria-describedby')?.split(' ')).toEqual(['existing-description', hint.id]);
  });

  it('uses the recommended delay when opening on hover', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    render(
      <TargetWithHint renderContent={() => 'Hint content'} withDelay>
        Target
      </TargetWithHint>,
    );
    const target = screen.getByRole('button');

    fireEvent.mouseEnter(target);
    act(() => vi.advanceTimersByTime(HINT_DELAY - 1));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('supports click mode and keeps the existing target id', () => {
    render(
      <TargetWithHint id="target-id" renderContent={() => 'Hint content'} triggerMode="click">
        Target
      </TargetWithHint>,
    );
    const target = screen.getByRole('button');

    expect(target).toHaveAttribute('id', 'target-id');
    expect(target).toHaveAttribute('aria-haspopup', 'dialog');
    expect(target).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(target);

    const hint = screen.getByRole('dialog');
    expect(target).toHaveAttribute('aria-expanded', 'true');
    expect(target).toHaveAttribute('aria-controls', hint.id);
    expect(hint).toHaveAttribute('aria-labelledby', 'target-id');
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
  });

  it('preserves and merges click-mode aria attributes', () => {
    render(
      <TargetWithHint
        renderContent={() => 'Hint content'}
        triggerMode="click"
        aria-controls="existing-controls"
        aria-expanded
        aria-haspopup="menu"
      >
        Target
      </TargetWithHint>,
    );
    const target = screen.getByRole('button');

    expect(target).toHaveAttribute('aria-controls', 'existing-controls');
    expect(target).toHaveAttribute('aria-expanded', 'false');
    expect(target).toHaveAttribute('aria-haspopup', 'dialog');
    fireEvent.click(target);

    expect(target.getAttribute('aria-controls')?.split(' ')).toEqual([
      'existing-controls',
      screen.getByRole('dialog').id,
    ]);
  });

  it.each([
    ['', 'empty string'],
    [undefined, 'undefined'],
    [null, 'null'],
    [false, 'false'],
    [true, 'true'],
  ])('does not render a hint for %s content', (content, _description) => {
    render(<TargetWithHint renderContent={() => content}>Target</TargetWithHint>);
    const target = screen.getByRole('button');

    fireEvent.mouseEnter(target);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(target).not.toHaveAttribute('aria-describedby');
  });

  it.each([0, <span key="node">Node content</span>])('renders valid falsy or React node content', (content) => {
    render(<TargetWithHint renderContent={() => content}>Target</TargetWithHint>);

    fireEvent.mouseEnter(screen.getByRole('button'));

    expect(screen.getByRole('tooltip')).toHaveTextContent(content === 0 ? '0' : 'Node content');
  });

  it('forwards the target, hint ref, position and style configuration', () => {
    const hintRef = createRef<HTMLDivElement>();
    const hintTargetElement = document.createElement('div');
    render(
      <TargetWithHint
        renderContent={() => 'Hint content'}
        hintRef={hintRef}
        hintTargetElement={hintTargetElement}
        hintPosition="right"
        hintStyles={{
          className: 'custom-hint',
          style: { maxWidth: '200px' },
          cssMixin: css`
            color: rgb(1, 2, 3);
          `,
        }}
      >
        Target
      </TargetWithHint>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));

    const hint = screen.getByRole('tooltip');
    expect(hint).toHaveClass('custom-hint');
    expect(hint).toHaveStyle({ maxWidth: '200px', color: 'rgb(1, 2, 3)' });
    expect(hintRef.current).toBe(hint.parentElement);
    expect(screen.getByRole('button')).not.toHaveAttribute('hintTargetElement');
  });

  it('forwards close button attributes in click mode', () => {
    render(
      <TargetWithHint
        renderContent={() => 'Hint content'}
        triggerMode="click"
        closeButtonProps={{ 'aria-label': 'Dismiss hint', 'data-testid': 'dismiss-hint' }}
      >
        Target
      </TargetWithHint>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Target' }));

    expect(screen.getByRole('button', { name: 'Dismiss hint' })).toHaveAttribute('data-testid', 'dismiss-hint');
  });
});
