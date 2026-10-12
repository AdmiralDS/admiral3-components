import { createRef, forwardRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { css } from 'styled-components';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  HINT_CONTENT_PADDING,
  HINT_CONTENT_PADDING_WITH_CLOSE,
  HINT_LAYOUTS,
  HINT_PADDING,
  HINT_POSITION_CONFIG,
} from './constants';
import { Hint } from './Hint';
import { HintLabel } from './HintLabel';
import { getHintTooltipDirection, type HintTooltipInternalPosition } from '../_internal/FloatingPortal';

vi.mock('../_internal/FloatingPortal', async (importOriginal) => ({
  ...(await importOriginal()),
  getHintTooltipDirection: vi.fn(() => 'bottom'),
  FloatingPortal: forwardRef<HTMLDivElement, React.ComponentProps<'div'> & { targetElement: Element | null }>(
    ({ targetElement: _targetElement, ...props }, ref) => <div ref={ref} {...props} />,
  ),
}));

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
    vi.mocked(getHintTooltipDirection).mockReturnValue('bottom');
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

  it.each([0, <span key="node">Node content</span>])('renders valid falsy or React node content', (content) => {
    render(<Hint targetElement={targetElement}>{content}</Hint>);
    expect(screen.getByRole('tooltip')).toHaveTextContent(content === 0 ? '0' : 'Node content');
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
    expect(getHintTooltipDirection).toHaveBeenCalledWith(
      targetElement,
      expect.objectContaining({ width: 0, height: 0 }),
      expect.any(HTMLDivElement),
      'right',
      HINT_POSITION_CONFIG,
    );
  });

  it.each(Object.entries(HINT_LAYOUTS))(
    'applies layout for the %s direction',
    (direction, { flexDirection, alignSelf, fullWidth, margin }) => {
      vi.mocked(getHintTooltipDirection).mockReturnValue(direction as HintTooltipInternalPosition);
      render(
        <Hint targetElement={targetElement} data-testid="hint">
          Content
        </Hint>,
      );

      act(() => animationFrameCallback?.(0));

      const wrapper = screen.getByTestId('hint').parentElement!;
      expect(wrapper).toHaveStyle({ alignSelf, margin, opacity: '1' });
      expect(wrapper.parentElement).toHaveStyle({ flexDirection });
      expect(wrapper.parentElement).toHaveStyle({ width: fullWidth ? '100%' : '0px' });
    },
  );

  it('applies a newly selected direction after an environment update', () => {
    vi.mocked(getHintTooltipDirection).mockReturnValueOnce('bottom').mockReturnValue('top');
    render(
      <Hint targetElement={targetElement} data-testid="hint">
        Content
      </Hint>,
    );
    act(() => animationFrameCallback?.(0));

    act(() => window.dispatchEvent(new Event('resize')));
    act(() => animationFrameCallback?.(0));

    const wrapper = screen.getByTestId('hint').parentElement!;
    expect(wrapper).toHaveStyle({
      alignSelf: HINT_LAYOUTS.top.alignSelf,
      margin: HINT_LAYOUTS.top.margin,
    });
    expect(wrapper.parentElement).toHaveStyle({ flexDirection: HINT_LAYOUTS.top.flexDirection });
  });

  it.each([
    ['bottom', 500, 'column'],
    ['top', 750, 'column-reverse'],
  ] as const)(
    'places a mobile Hint on the %s and stretches its portal to the viewport',
    (_, targetBottom, flexDirection) => {
      vi.stubGlobal('innerWidth', 639);
      vi.stubGlobal('innerHeight', 800);
      vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, targetBottom - 40, 100, 40));
      render(
        <Hint targetElement={targetElement} data-testid="hint">
          Content
        </Hint>,
      );
      const wrapper = screen.getByTestId('hint').parentElement!;
      vi.spyOn(wrapper, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 300, 200));

      act(() => animationFrameCallback?.(0));

      expect(getHintTooltipDirection).not.toHaveBeenCalled();
      expect(screen.getByTestId('hint')).toHaveStyle({ maxWidth: 'calc(100vw - 32px)' });
      expect(wrapper).toHaveStyle({ alignSelf: 'center' });
      expect(wrapper.parentElement).toHaveStyle({ flexDirection, left: '0px', width: '100%' });
    },
  );

  it.each([
    ['', 'empty string'],
    [undefined, 'undefined'],
    [null, 'null'],
    [false, 'false'],
    [true, 'true'],
  ])('renders nothing for %s content', (content, _description) => {
    render(<Hint targetElement={targetElement}>{content}</Hint>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('renders nothing without a target', () => {
    render(<Hint targetElement={null}>Content</Hint>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
