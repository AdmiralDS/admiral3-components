import { createRef, forwardRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { css } from 'styled-components';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HINT_CONTENT_PADDING, HINT_CONTENT_PADDING_WITH_CLOSE, HINT_PADDING } from './constants';
import { Hint } from './Hint';
import { HintLabel } from './style';
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

  it('applies the fixed layout styles', () => {
    render(
      <Hint targetElement={targetElement} data-testid="hint">
        Content
      </Hint>,
    );
    expect(screen.getByTestId('hint')).toHaveStyle({ padding: HINT_PADDING });
    expect(screen.getByTestId('hint')).not.toHaveAttribute('data-dimension');
  });

  it('applies the hint style configuration to the visual container', () => {
    render(
      <Hint
        targetElement={targetElement}
        hintStyles={{
          className: 'custom-hint',
          style: { maxWidth: '200px' },
          cssMixin: css`
            color: rgb(1, 2, 3);
          `,
        }}
      >
        Content
      </Hint>,
    );

    const hint = screen.getByRole('tooltip');
    expect(hint).toHaveClass('custom-hint');
    expect(hint).toHaveStyle({ maxWidth: '200px', color: 'rgb(1, 2, 3)' });
  });

  it('renders the standard hint label', () => {
    render(<HintLabel>Title</HintLabel>);
    expect(screen.getByText('Title')).toHaveStyle({ fontSize: '14px', fontWeight: '550', lineHeight: '20px' });
  });

  it('renders the close icon only when requested and handles its click', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Hint targetElement={targetElement}>Content</Hint>);
    expect(screen.queryByRole('button', { name: 'Закрыть подсказку' })).not.toBeInTheDocument();

    rerender(
      <Hint
        targetElement={targetElement}
        showCloseIcon
        closeButtonProps={{
          'aria-label': 'Закрыть подсказку',
          'data-testid': 'custom-close-button',
          id: 'close-hint',
          title: 'Закрыть',
          tabIndex: -1,
        }}
        onClose={onClose}
      >
        Content
      </Hint>,
    );
    const closeButton = screen.getByRole('button', { name: 'Закрыть подсказку' });
    expect(closeButton).toHaveAttribute('data-testid', 'custom-close-button');
    expect(closeButton).toHaveAttribute('id', 'close-hint');
    expect(closeButton).toHaveAttribute('title', 'Закрыть');
    expect(closeButton).toHaveAttribute('tabindex', '-1');
    expect(closeButton).toHaveAttribute('type', 'button');
    expect(closeButton).toHaveStyle({ position: 'absolute', top: '12px', right: '16px' });
    expect(closeButton.previousElementSibling).toHaveStyle({ padding: HINT_CONTENT_PADDING_WITH_CLOSE });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('limits its height and enables vertical scrolling', () => {
    render(
      <Hint targetElement={targetElement} data-testid="hint">
        Content
      </Hint>,
    );
    const hint = screen.getByTestId('hint');
    expect(hint).toHaveStyle({ maxHeight: '320px' });
    expect(hint.firstElementChild).toHaveStyle({
      minHeight: '0',
      overflow: 'auto',
      padding: HINT_CONTENT_PADDING,
    });
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
