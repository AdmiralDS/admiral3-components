import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as overflowUtils from '#src/utils/checkOverflow';

import { Chips } from './Chips';

describe('Chips', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('native tooltip', () => {
    beforeEach(() => {
      vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    });

    it('shows string children only while hovered and overflowing', () => {
      render(<Chips data-testid="chips">Long filter name</Chips>);
      const chip = screen.getByTestId('chips');
      expect(chip).not.toHaveAttribute('title');
      fireEvent.mouseEnter(chip);
      expect(chip).toHaveAttribute('title', 'Long filter name');
      expect(overflowUtils.checkOverflow).toHaveBeenCalledWith(screen.getByText('Long filter name'));
      fireEvent.mouseLeave(chip);
      expect(chip).not.toHaveAttribute('title');
    });

    it('uses custom tooltip content for rich children', () => {
      render(
        <Chips data-testid="chips" renderContentTooltip={() => 'Custom tooltip'}>
          <strong>Filter</strong>
        </Chips>,
      );
      fireEvent.mouseEnter(screen.getByTestId('chips'));
      expect(screen.getByTestId('chips')).toHaveAttribute('title', 'Custom tooltip');
    });

    it('prefers custom text over string children', () => {
      render(
        <Chips data-testid="chips" renderContentTooltip={() => 'Custom tooltip'}>
          Filter
        </Chips>,
      );
      fireEvent.mouseEnter(screen.getByTestId('chips'));
      expect(screen.getByTestId('chips')).toHaveAttribute('title', 'Custom tooltip');
    });

    it('does not show a tooltip when the content fits, even with custom text', () => {
      vi.mocked(overflowUtils.checkOverflow).mockReturnValue(false);
      render(
        <Chips data-testid="chips" renderContentTooltip={() => 'Custom tooltip'}>
          Filter
        </Chips>,
      );
      fireEvent.mouseEnter(screen.getByTestId('chips'));
      expect(screen.getByTestId('chips')).not.toHaveAttribute('title');
    });

    it.each([
      { name: 'rich content', children: <strong>Filter</strong> },
      { name: 'number', children: 42 },
      { name: 'empty string', children: '' },
    ])('does not infer a tooltip from $name', ({ children }) => {
      render(<Chips data-testid="chips">{children}</Chips>);
      fireEvent.mouseEnter(screen.getByTestId('chips'));
      expect(screen.getByTestId('chips')).not.toHaveAttribute('title');
    });

    it('skips overflow checks and hover listeners when disabledTooltip is set', () => {
      render(
        <Chips data-testid="chips" disabledTooltip renderContentTooltip={() => 'Custom tooltip'}>
          Filter
        </Chips>,
      );
      fireEvent.mouseEnter(screen.getByTestId('chips'));
      expect(screen.getByTestId('chips')).not.toHaveAttribute('title');
      expect(overflowUtils.checkOverflow).not.toHaveBeenCalled();
    });

    it('hides the tooltip when disabledTooltip changes and restores it when enabled', () => {
      const { rerender } = render(<Chips data-testid="chips">Filter</Chips>);
      const chip = screen.getByTestId('chips');
      fireEvent.mouseEnter(chip);
      expect(chip).toHaveAttribute('title', 'Filter');
      rerender(
        <Chips data-testid="chips" disabledTooltip>
          Filter
        </Chips>,
      );
      expect(chip).not.toHaveAttribute('title');
      vi.mocked(overflowUtils.checkOverflow).mockClear();
      fireEvent.mouseLeave(chip);
      fireEvent.mouseEnter(chip);
      expect(overflowUtils.checkOverflow).not.toHaveBeenCalled();
      rerender(<Chips data-testid="chips">Filter</Chips>);
      fireEvent.mouseLeave(chip);
      fireEvent.mouseEnter(chip);
      expect(chip).toHaveAttribute('title', 'Filter');
    });

    it('rechecks overflow on the next hover', () => {
      render(<Chips data-testid="chips">Filter</Chips>);
      const chip = screen.getByTestId('chips');
      fireEvent.mouseEnter(chip);
      expect(chip).toHaveAttribute('title', 'Filter');
      fireEvent.mouseLeave(chip);
      vi.mocked(overflowUtils.checkOverflow).mockReturnValue(false);
      fireEvent.mouseEnter(chip);
      expect(chip).not.toHaveAttribute('title');
    });
  });

  describe.each([{ disabled: true }, { readOnly: true }, { disabled: true, readOnly: true }])(
    'blocked events: %j',
    (state) => {
      it('blocks programmatic clicks on the wrapper and content and restores them when enabled', () => {
        const onClick = vi.fn();
        const { rerender } = render(
          <Chips {...state} onClick={onClick} data-testid="chips">
            Filter
          </Chips>,
        );
        screen.getByTestId('chips').click();
        screen.getByRole('button', { name: 'Filter' }).click();
        expect(onClick).not.toHaveBeenCalled();

        rerender(
          <Chips onClick={onClick} data-testid="chips">
            Filter
          </Chips>,
        );
        screen.getByTestId('chips').click();
        screen.getByRole('button', { name: 'Filter' }).click();
        expect(onClick).toHaveBeenCalledTimes(2);
      });

      it.each(['Enter', ' ', 'Backspace'])('blocks removal with %s', (key) => {
        const onClose = vi.fn();
        const onKeyDown = vi.fn();
        render(
          <Chips {...state} selected={false} onClose={onClose} onKeyDown={onKeyDown}>
            Filter
          </Chips>,
        );
        fireEvent.keyDown(screen.getByRole('button', { name: 'Filter' }), { key });
        expect(onClose).not.toHaveBeenCalled();
        expect(onKeyDown).not.toHaveBeenCalled();
      });

      it.each([
        ['onClick', 'click'],
        ['onClickCapture', 'click'],
        ['onDoubleClick', 'doubleClick'],
        ['onMouseDown', 'mouseDown'],
        ['onMouseEnter', 'mouseEnter'],
        ['onPointerDown', 'pointerDown'],
        ['onPointerDownCapture', 'pointerDown'],
        ['onKeyDown', 'keyDown'],
        ['onKeyDownCapture', 'keyDown'],
        ['onKeyUp', 'keyUp'],
        ['onFocus', 'focusIn'],
        ['onBlur', 'focusOut'],
        ['onTouchStart', 'touchStart'],
        ['onContextMenu', 'contextMenu'],
        ['onWheel', 'wheel'],
      ] as const)('blocks %s and preserves other attributes', (handlerName, eventName) => {
        const handler = vi.fn();
        const { rerender } = render(
          <Chips {...state} {...{ [handlerName]: handler }} data-testid="chips" lang="ru">
            Filter
          </Chips>,
        );
        const chip = screen.getByTestId('chips');
        fireEvent[eventName](chip, { key: 'Enter' });
        expect(handler).not.toHaveBeenCalled();
        expect(chip).toHaveAttribute('lang', 'ru');
        rerender(
          <Chips {...{ [handlerName]: handler }} data-testid="chips" lang="ru">
            Filter
          </Chips>,
        );
        fireEvent[eventName](chip, { key: 'Enter' });
        expect(handler).toHaveBeenCalledOnce();
      });
    },
  );

  describe.each(['iconBefore', 'iconAfter', 'avatar'] as const)('%s slot', (slot) => {
    it.each([false, true, null, undefined, ''])('does not create a wrapper for %s', (value) => {
      render(
        <Chips data-testid="chips" {...{ [slot]: value }}>
          Filter
        </Chips>,
      );
      const content = screen.getByTestId('chips').firstElementChild!;
      expect(content.children).toHaveLength(1);
      expect(content).toHaveTextContent('Filter');
    });

    it.each([0, 'Avatar'])('keeps %s inside its slot wrapper', (value) => {
      render(
        <Chips data-testid="chips" {...{ [slot]: value }}>
          Filter
        </Chips>,
      );
      const content = screen.getByTestId('chips').firstElementChild!;
      expect(content.children).toHaveLength(2);
      const wrapper = slot === 'iconAfter' ? content.lastElementChild : content.firstElementChild;
      expect(wrapper).toHaveTextContent(String(value));
    });
  });

  it('renders children and forwards div attributes and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Chips ref={ref} data-testid="chips" id="filter" lang="ru" className="custom">
        Content
      </Chips>,
    );
    const chip = screen.getByTestId('chips');
    expect(ref.current).toBe(chip);
    expect(chip).toHaveTextContent('Content');
    expect(chip).toHaveAttribute('id', 'filter');
    expect(chip).toHaveAttribute('lang', 'ru');
    expect(chip).toHaveClass('custom');
  });

  it.each([
    ['s', 20],
    ['m', 24],
    ['l', 32],
  ] as const)('renders dimension %s with height %s', (dimension, height) => {
    render(
      <Chips dimension={dimension} data-testid="chips">
        Filter
      </Chips>,
    );
    expect(screen.getByTestId('chips')).toHaveStyle({ height: height + 'px' });
    expect(screen.getByTestId('chips')).not.toHaveAttribute('dimension');
  });

  it('does not forward component props to the DOM', () => {
    render(<Chips data-testid="chips" appearance="flat" colorMode="neutral" selected disabled readOnly />);
    for (const name of ['appearance', 'colorMode', 'selected', 'disabled', 'readOnly']) {
      expect(screen.getByTestId('chips')).not.toHaveAttribute(name);
    }
  });

  it.each([0, 5])('renders badge value %s', (badge) => {
    render(<Chips badge={badge}>Filter</Chips>);
    expect(screen.getByText(String(badge))).toBeVisible();
  });

  it('renders start and end icons and an avatar', () => {
    render(
      <Chips
        iconBefore={<span data-testid="start" />}
        iconAfter={<span data-testid="end" />}
        avatar={<span data-testid="avatar" />}
      >
        Filter
      </Chips>,
    );
    for (const id of ['start', 'end', 'avatar']) expect(screen.getByTestId(id)).toBeInTheDocument();
  });

  it('replaces the end icon with a close button when onClose is set', () => {
    render(
      <Chips onClose={vi.fn()} iconAfter={<span data-testid="end" />}>
        Filter
      </Chips>,
    );
    expect(screen.queryByTestId('end')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
  });

  it('does not render a close button without onClose or in readOnly mode', () => {
    const { rerender } = render(<Chips>Filter</Chips>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(
      <Chips readOnly onClose={vi.fn()}>
        Filter
      </Chips>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClose without calling onClick', () => {
    const onClose = vi.fn();
    const onClick = vi.fn();
    render(
      <Chips id="filter" onClick={onClick} onClose={onClose}>
        Filter
      </Chips>,
    );
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(onClose).toHaveBeenCalledExactlyOnceWith();
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('calls onClick for the main chip area without closing', () => {
    const onClose = vi.fn();
    const onClick = vi.fn();
    render(
      <Chips data-testid="chips" onClick={onClick} onClose={onClose}>
        Filter
      </Chips>,
    );
    fireEvent.click(screen.getByTestId('chips'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });

  it.each(['Enter', ' '])('activates the chip with %s', (key) => {
    const onClick = vi.fn();
    render(
      <Chips data-testid="chips" onClick={onClick}>
        Filter
      </Chips>,
    );
    const button = screen.getByRole('button', { name: 'Filter' });
    fireEvent.keyDown(button, { key });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards non-activation keyboard events without activating', () => {
    const onKeyDown = vi.fn();
    const onClick = vi.fn();
    render(
      <Chips data-testid="chips" onClick={onClick} onKeyDown={onKeyDown}>
        Filter
      </Chips>,
    );
    fireEvent.keyDown(screen.getByTestId('chips'), { key: 'Escape' });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disables the native close button when disabled', () => {
    const onClose = vi.fn();
    render(
      <Chips disabled onClose={onClose}>
        Filter
      </Chips>,
    );
    screen.getByRole('button', { name: '' }).click();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '' })).toBeDisabled();
  });

  it.each([
    { disabled: true, readOnly: false },
    { disabled: false, readOnly: true },
    { disabled: true, readOnly: true },
  ])('blocks handlers when disabled=$disabled and readOnly=$readOnly and restores them when enabled', (state) => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    const onKeyDown = vi.fn();
    const renderChip = ({ disabled, readOnly }: typeof state) => (
      <Chips
        data-testid="chips"
        disabled={disabled}
        readOnly={readOnly}
        onClick={onClick}
        onClose={onClose}
        onKeyDown={onKeyDown}
      >
        Filter
      </Chips>
    );
    const { rerender } = render(renderChip(state));
    fireEvent.click(screen.getByTestId('chips'));
    fireEvent.keyDown(screen.getByTestId('chips'), { key: 'Enter' });
    fireEvent.keyDown(screen.getByTestId('chips'), { key: ' ' });
    expect(onClick).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();
    rerender(renderChip({ disabled: false, readOnly: false }));
    fireEvent.click(screen.getByTestId('chips'));
    expect(onClick).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(onClose).toHaveBeenCalledOnce();
    fireEvent.keyDown(screen.getByTestId('chips'), { key: 'Escape' });
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  describe('accessibility and interaction regressions', () => {
    it.each(['Enter', ' ', 'Backspace'])('removes from the main button with %s when there is no onClick', (key) => {
      const onClose = vi.fn();
      render(
        <Chips id="filter" onClose={onClose}>
          Filter
        </Chips>,
      );
      fireEvent.keyDown(screen.getByRole('button', { name: 'Filter' }), { key });
      expect(onClose).toHaveBeenCalledExactlyOnceWith();
    });

    it.each(['Delete', 'Tab'])('forwards %s without activating or removing', (key) => {
      const onClose = vi.fn();
      const onClick = vi.fn();
      const onKeyDown = vi.fn();
      render(
        <Chips onClick={onClick} onClose={onClose} onKeyDown={onKeyDown}>
          Filter
        </Chips>,
      );
      fireEvent.keyDown(screen.getByRole('button', { name: 'Filter' }), { key });
      expect(onClose).not.toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalledOnce();
    });

    it.each(['Enter', ' '])('prioritizes removal over selection on %s and then calls onKeyDown', (key) => {
      const calls: string[] = [];
      const onClick = vi.fn();
      render(
        <Chips
          onClick={onClick}
          onClose={() => calls.push('close')}
          onKeyDown={(event) => {
            calls.push('keydown');
            event.preventDefault();
          }}
        >
          Filter
        </Chips>,
      );
      fireEvent.keyDown(screen.getByRole('button', { name: 'Filter' }), { key });
      expect(calls).toEqual(['close', 'keydown']);
      expect(onClick).not.toHaveBeenCalled();
    });

    it.each(['Enter', ' '])('does not activate a disabled chip on %s', (key) => {
      const onClose = vi.fn();
      const onKeyDown = vi.fn();
      render(
        <Chips disabled onClose={onClose} onKeyDown={onKeyDown}>
          Filter
        </Chips>,
      );
      fireEvent.keyDown(screen.getByRole('button', { name: 'Filter' }), { key });
      expect(onClose).not.toHaveBeenCalled();
      expect(onKeyDown).not.toHaveBeenCalled();
    });
    it('renders sibling action and close buttons without nested interactive elements', () => {
      render(
        <Chips selected={false} onClick={vi.fn()} onClose={vi.fn()}>
          Filter
        </Chips>,
      );
      const action = screen.getByRole('button', { name: 'Filter' });
      const close = screen.getByRole('button', { name: '' });
      expect(action.contains(close)).toBe(false);
      expect(action.parentElement).toBe(close.parentElement);
      expect(action).toHaveAttribute('aria-pressed', 'false');
      expect(close.tabIndex).toBe(-1);
    });

    it('renders the close button with rich chip content', () => {
      render(
        <Chips onClose={vi.fn()}>
          <strong>Filter</strong>
        </Chips>,
      );
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
    });

    it('applies accessible name overrides to the action button', () => {
      render(
        <Chips aria-label="Choose filter" onClick={vi.fn()}>
          Filter
        </Chips>,
      );
      expect(screen.getByRole('button', { name: 'Choose filter' })).toBeInTheDocument();
    });

    it('announces readOnly and hides close', () => {
      render(
        <Chips selected readOnly onClose={vi.fn()}>
          Filter
        </Chips>,
      );
      const action = screen.getByRole('button', { name: 'Filter' });
      expect(action).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument();
    });
    it('keeps a disabled chip out of the tab order by default', () => {
      render(
        <Chips disabled data-testid="chips" onClick={vi.fn()}>
          Filter
        </Chips>,
      );
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute('tabindex', '-1');
    });

    it('announces disabled state on a non-native interactive root', () => {
      render(
        <Chips disabled data-testid="chips" onClick={vi.fn()}>
          Filter
        </Chips>,
      );
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('exposes selected state for a selectable chip', () => {
      render(
        <Chips selected onClick={vi.fn()}>
          Filter
        </Chips>,
      );
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('keeps the outer wrapper out of the tab order', () => {
      render(<Chips data-testid="chips">Filter</Chips>);
      expect(screen.getByTestId('chips').tabIndex).toBeLessThan(0);
    });

    it('prevents the default Space event during activation', () => {
      render(
        <Chips onClick={vi.fn()} data-testid="chips">
          Filter
        </Chips>,
      );
      expect(fireEvent.keyDown(screen.getByRole('button', { name: 'Filter' }), { key: ' ', cancelable: true })).toBe(
        false,
      );
    });

    it('calls onClose through native close button activation', () => {
      const onClose = vi.fn();
      render(
        <Chips id="filter" onClose={onClose} data-testid="chips">
          Filter
        </Chips>,
      );
      screen.getByRole('button', { name: '' }).click();
      expect(onClose).toHaveBeenCalledExactlyOnceWith();
    });
  });
});
