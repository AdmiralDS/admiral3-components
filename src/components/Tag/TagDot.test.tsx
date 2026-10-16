import { createRef, type ComponentProps, type RefAttributes } from 'react';

import { themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import type { TagDotProps } from '@admiral-ds/admiral3-components';

import { TAG_DIMENSIONS, TAG_DIMENSION_PARAMETRS, TAG_STATUSES } from './constants';
import { TagDot } from './TagDot';

const label = 'Документ согласован всеми участниками рабочего процесса';

const renderTag = (props: ComponentProps<typeof TagDot> = {}) =>
  render(
    <TagDot data-testid="tag" {...props}>
      {props.children ?? 'Content'}
    </TagDot>,
    {
      wrapper: ({ children }) => <ThemeProvider theme={themes.light}>{children}</ThemeProvider>,
    },
  );

const setTextWidth = (scrollWidth: number, clientWidth = 100) => {
  const text = screen.getByText(label);
  Object.defineProperties(text, {
    scrollWidth: { configurable: true, value: scrollWidth },
    clientWidth: { configurable: true, value: clientWidth },
  });
};

describe('TagDot', () => {
  it('exposes TagDotProps without an icon slot', () => {
    expectTypeOf<ComponentProps<typeof TagDot>>().toEqualTypeOf<TagDotProps & RefAttributes<HTMLButtonElement>>();
    expectTypeOf<TagDotProps>().not.toHaveProperty('iconsBefore');
  });

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders a native button with an accessible name and button type', () => {
    renderTag({ children: 'Document status' });

    const tag = screen.getByRole('button', { name: 'Document status' });
    expect(tag).toHaveAttribute('type', 'button');
    expect(tag).toHaveAttribute('data-dimension', 'm');
    expect(tag).not.toHaveAttribute('data-with-border');
  });

  it('forwards native attributes and an explicit accessible name', () => {
    renderTag({ id: 'document-status', title: 'Details', className: 'consumer-class', 'aria-label': 'Open document' });

    const tag = screen.getByRole('button', { name: 'Open document' });
    expect(tag).toHaveAttribute('id', 'document-status');
    expect(tag).toHaveAttribute('title', 'Details');
    expect(tag).toHaveClass('consumer-class');
  });

  it('forwards a ref to the root button and clears it on unmount', () => {
    const ref = createRef<HTMLButtonElement>();
    const { unmount } = renderTag({ ref });

    expect(ref.current).toBe(screen.getByRole('button'));
    unmount();
    expect(ref.current).toBeNull();
  });

  it('excludes a passive tag from the Tab sequence', () => {
    renderTag();

    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button')).toHaveStyle({ cursor: 'default' });
  });

  it('makes a clickable tag focusable and forwards clicks once', () => {
    const onClick = vi.fn();
    renderTag({ onClick });
    const tag = screen.getByRole('button');

    expect(tag).toHaveAttribute('tabindex', '0');
    expect(tag).toHaveStyle({ cursor: 'pointer' });
    fireEvent.click(tag);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0].target).toBe(tag);
  });

  it.each([-1, 0, 3])('respects explicit tabIndex=%s', (tabIndex) => {
    renderTag({ tabIndex, onClick: vi.fn() });

    expect(screen.getByRole('button')).toHaveAttribute('tabindex', String(tabIndex));
  });

  it('preserves consumer focus and keyboard handlers', () => {
    const onFocus = vi.fn();
    const onKeyDown = vi.fn();
    renderTag({ onClick: vi.fn(), onFocus, onKeyDown });
    const tag = screen.getByRole('button');

    fireEvent.focus(tag);
    fireEvent.keyDown(tag, { key: 'Enter' });
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onKeyDown.mock.calls[0][0].key).toBe('Enter');
  });

  it.each(TAG_DIMENSIONS)('applies %s geometry and keeps internal props out of the DOM', (dimension) => {
    renderTag({ dimension, withBorder: true });
    const tag = screen.getByRole('button');
    const { height, paddingBlock, paddingInline } = TAG_DIMENSION_PARAMETRS[dimension];

    expect(tag).toHaveAttribute('data-dimension', dimension);
    expect(tag).toHaveStyle({
      height: `${height}px`,
      paddingBlock: `${paddingBlock}px`,
      paddingInline: `${paddingInline}px`,
    });
    for (const attribute of ['dimension', 'status', 'withBorder', '$dimension', '$status', '$clickable']) {
      expect(tag).not.toHaveAttribute(attribute);
    }
  });

  it('adds the border marker only while the border is enabled', () => {
    const { rerender } = renderTag({ withBorder: true });

    expect(screen.getByRole('button')).toHaveAttribute('data-with-border', '');
    rerender(<TagDot>Content</TagDot>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-with-border');
  });

  it('does not open a tooltip when text fits', () => {
    renderTag({ children: label });
    setTextWidth(80);

    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens a linked tooltip for overflowing text and preserves onMouseEnter', () => {
    const onMouseEnter = vi.fn();
    renderTag({ children: label, onMouseEnter });
    setTextWidth(250);

    const tag = screen.getByRole('button');
    fireEvent.mouseEnter(tag);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent(label);
    expect(tag).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tag).toHaveAccessibleDescription(label);
    expect(onMouseEnter).toHaveBeenCalledOnce();
  });

  it('keeps the tooltip open when the pointer moves from the tag into it', () => {
    renderTag({ children: label });
    setTextWidth(250);
    const tag = screen.getByRole('button');

    fireEvent.mouseEnter(tag);
    const tooltip = screen.getByRole('tooltip');
    fireEvent.mouseLeave(tag, { relatedTarget: tooltip });

    expect(tooltip).toBeInTheDocument();
  });

  it('closes the tooltip on Escape and removes its description link', () => {
    renderTag({ children: label });
    setTextWidth(250);
    const tag = screen.getByRole('button');

    fireEvent.mouseEnter(tag);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(tag).not.toHaveAttribute('aria-describedby');
  });

  it('closes the tooltip when the pointer leaves both the tag and tooltip', () => {
    const onMouseLeave = vi.fn();
    renderTag({ children: label, onMouseLeave });
    setTextWidth(250);
    const tag = screen.getByRole('button');

    fireEvent.mouseEnter(tag);
    fireEvent.mouseLeave(tag, { relatedTarget: document.body });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(tag).not.toHaveAttribute('aria-describedby');
    expect(onMouseLeave).toHaveBeenCalledOnce();
  });

  it.each(TAG_STATUSES)('uses %s for the decorative dot', (status) => {
    renderTag({ status });
    const tag = screen.getByRole('button');
    const dot = tag.querySelector('[data-appearance]');

    expect(dot).toHaveAttribute('data-appearance', status);
    expect(dot).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(TAG_DIMENSIONS)('keeps the dot fixed for %s tags and truncates only the text', (dimension) => {
    renderTag({ dimension });
    const dot = screen.getByRole('button').querySelector('[data-appearance]');
    const size = dimension === 'l' ? 10 : 8;

    expect(dot).toHaveAttribute('data-dimension', dimension === 'l' ? 'm' : 's');
    expect(dot).toHaveStyle({ width: `${size}px`, height: `${size}px`, flexShrink: '0' });
    expect(screen.getByText('Content')).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
  });

  it('applies custom dot, text, background and border colors without serializing the config', () => {
    renderTag({
      withBorder: true,
      status: {
        dotColor: '#d2409b',
        textColor: '#102030',
        background: { rest: '#fbeff5', hover: '#fbdff1', press: '#f6d3ea' },
        border: '#aabbcc',
      },
    });
    const tag = screen.getByRole('button');
    const dot = tag.querySelector('[data-appearance]');

    expect(tag).toHaveAttribute('data-status', 'custom');
    expect(tag).not.toHaveAttribute('status');
    expect(tag).toHaveStyle({ backgroundColor: '#fbeff5', borderColor: '#aabbcc' });
    expect(dot).toHaveAttribute('data-appearance', 'custom');
    expect(dot).toHaveStyle({ backgroundColor: '#d2409b' });
    expect(screen.getByText('Content')).toHaveStyle({ color: '#102030' });
  });

  it('uses a neutral dot when a custom config does not include dotColor', () => {
    renderTag({ status: { textColor: '#102030' } });

    expect(screen.getByRole('button').querySelector('[data-appearance]')).toHaveAttribute('data-appearance', 'neutral');
  });
});
