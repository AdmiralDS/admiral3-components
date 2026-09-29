import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as overflowUtils from '#src/utils/checkOverflow';

import { Chips } from '../Chips';
import { FilterChips } from './FilterChips';

describe('FilterChips', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('reuses Chips tooltip behavior', () => {
    vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    render(
      <FilterChips value={[]}>
        <FilterChips.Item id="first" data-testid="first" renderContentTooltip={() => 'Filter tooltip'}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );

    fireEvent.mouseEnter(screen.getByTestId('first'));
    expect(screen.getByTestId('first')).toHaveAttribute('title', 'Filter tooltip');
  });

  it('selects and deselects items in multiple mode without changing the controlled value itself', () => {
    const onChange = vi.fn();
    const renderGroup = (value: string[]) => (
      <FilterChips value={value} onChange={onChange} aria-label="Filters">
        <FilterChips.Item id="first">First</FilterChips.Item>
        <FilterChips.Item id="second">Second</FilterChips.Item>
      </FilterChips>
    );
    const { rerender } = render(renderGroup(['first']));
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(second).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(second);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), ['first', 'second']);
    expect(second).toHaveAttribute('aria-pressed', 'false');

    rerender(renderGroup(['first', 'second']));
    expect(second).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(first);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['second']);
  });

  it('keeps multiple selection internally when value is omitted', () => {
    const onChange = vi.fn();
    const renderGroup = (defaultValue: string[]) => (
      <FilterChips defaultValue={defaultValue} onChange={onChange}>
        <FilterChips.Item id="first">First</FilterChips.Item>
        <FilterChips.Item id="second">Second</FilterChips.Item>
      </FilterChips>
    );
    const { rerender } = render(renderGroup(['first']));
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(second).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['first', 'second']);

    rerender(renderGroup(['second']));
    expect(first).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(first, { key: ' ' });
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['second']);
  });

  it('starts with no selection when neither value nor defaultValue is provided', () => {
    render(
      <FilterChips>
        <FilterChips.Item>First</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    expect(first).toHaveAttribute('aria-pressed', 'false');
    fireEvent.keyDown(first, { key: ' ' });
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses item content as the value unless an explicit id is provided', () => {
    const onChange = vi.fn();
    const renderGroup = (value: string[]) => (
      <FilterChips value={value} onChange={onChange}>
        <FilterChips.Item>Марс</FilterChips.Item>
        <FilterChips.Item id="venus-id">Венера</FilterChips.Item>
        <FilterChips.Item>{0}</FilterChips.Item>
      </FilterChips>
    );
    const { rerender } = render(renderGroup([]));

    fireEvent.click(screen.getByRole('button', { name: 'Марс' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['Марс']);

    rerender(renderGroup(['Марс']));
    expect(screen.getByRole('button', { name: 'Марс' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Венера' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['Марс', 'venus-id']);

    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['Марс', '0']);
  });

  it('selects only with Space and allows clearing the exclusive selection', () => {
    const onChange = vi.fn();
    const renderGroup = (value: string | null) => (
      <FilterChips exclusive value={value} onChange={onChange}>
        <FilterChips.Item id="first">First</FilterChips.Item>
        <FilterChips.Item id="second">Second</FilterChips.Item>
      </FilterChips>
    );
    const { rerender } = render(renderGroup('first'));
    const first = screen.getByRole('button', { name: 'First' });

    expect(screen.getByRole('group')).not.toHaveAttribute('aria-multiselectable');
    expect(fireEvent.keyDown(first, { key: 'Enter' })).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    expect(fireEvent.keyDown(first, { key: ' ' })).toBe(false);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), null);

    rerender(renderGroup(null));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Second' }), { key: ' ' });
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'second');
  });

  it('updates exclusive selection internally when value is omitted', () => {
    const onChange = vi.fn();
    render(
      <FilterChips exclusive defaultValue="first" onChange={onChange}>
        <FilterChips.Item id="first">First</FilterChips.Item>
        <FilterChips.Item id="second">Second</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    expect(first).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(first, { key: 'Enter' });
    expect(first).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(first, { key: ' ' });
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), null);

    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'second');
  });

  it('allows an Item onKeyDown handler to cancel selection', () => {
    const onChange = vi.fn();
    render(
      <FilterChips value={[]} onChange={onChange}>
        <FilterChips.Item id="first" onKeyDown={(event) => event.preventDefault()}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    fireEvent.keyDown(screen.getByRole('button', { name: 'First' }), { key: ' ' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange once for one Space press', () => {
    const onChange = vi.fn();
    render(
      <FilterChips onChange={onChange}>
        <FilterChips.Item id="first">First</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    fireEvent.keyDown(first, { key: ' ' });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), ['first']);
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it('rejects duplicate Item values, including disabled items', () => {
    expect(() =>
      render(
        <FilterChips>
          <FilterChips.Item id="same">First</FilterChips.Item>
          <FilterChips.Item id="same" disabled>
            Second
          </FilterChips.Item>
        </FilterChips>,
      ),
    ).toThrow('FilterChips.Item value "same" must be unique in its group');
  });

  it('keeps one Tab stop and navigates cyclically with arrows, Home and End', () => {
    const onChange = vi.fn();
    render(
      <FilterChips value={['second']} onChange={onChange}>
        <FilterChips.Item id="first">First</FilterChips.Item>
        <FilterChips.Item id="second">Second</FilterChips.Item>
        <FilterChips.Item id="third">Third</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    const third = screen.getByRole('button', { name: 'Third' });

    expect(second).toHaveAttribute('tabindex', '0');
    expect(first).toHaveAttribute('tabindex', '-1');
    expect(third).toHaveAttribute('tabindex', '-1');

    second.focus();
    fireEvent.keyDown(second, { key: 'ArrowRight' });
    expect(third).toHaveFocus();
    expect(third).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(third, { key: 'ArrowRight' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowLeft' });
    expect(third).toHaveFocus();
    fireEvent.keyDown(third, { key: 'Home' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'End' });
    expect(third).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.blur(third, { relatedTarget: document.body });
    expect(second).toHaveAttribute('tabindex', '0');
  });

  it('leaves ordinary Chips and other children outside group navigation', () => {
    const onClick = vi.fn();
    render(
      <FilterChips aria-label="Independent filters">
        <Chips selected onClick={onClick}>
          First
        </Chips>
        <Chips selected={false} onClick={onClick}>
          Second
        </Chips>
        <button type="button">Third</button>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    const third = screen.getByRole('button', { name: 'Third' });

    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '0');
    expect(third).not.toHaveAttribute('tabindex');

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(second, { key: ' ' });
    expect(onClick).toHaveBeenCalledOnce();
    expect(second).toHaveAttribute('aria-pressed', 'false');
  });

  it('navigates only FilterChips.Item when other children share the group', () => {
    render(
      <FilterChips value={[]}>
        <FilterChips.Item id="first">First</FilterChips.Item>
        <Chips selected={false}>Independent</Chips>
        <FilterChips.Item id="second">Second</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const independent = screen.getByRole('button', { name: 'Independent' });
    const second = screen.getByRole('button', { name: 'Second' });

    expect(first).toHaveAttribute('tabindex', '0');
    expect(independent).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();
    independent.focus();
    fireEvent.keyDown(independent, { key: 'ArrowLeft' });
    expect(independent).toHaveFocus();
  });

  it('skips disabled items and keeps read-only items navigable but not selectable', () => {
    const onChange = vi.fn();
    render(
      <FilterChips value={[]} onChange={onChange}>
        <FilterChips.Item id="first">First</FilterChips.Item>
        <FilterChips.Item id="disabled" disabled>
          Disabled
        </FilterChips.Item>
        <FilterChips.Item id="readonly" readOnly>
          Read-only
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const disabled = screen.getByRole('button', { name: 'Disabled' });
    const readOnly = screen.getByRole('button', { name: 'Read-only' });

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(readOnly).toHaveFocus();
    expect(disabled).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(readOnly, { key: ' ' });
    fireEvent.click(readOnly);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables FilterChips.Item through the group', () => {
    const onChange = vi.fn();
    render(
      <FilterChips disabled value={[]} onChange={onChange}>
        <FilterChips.Item id="first">First</FilterChips.Item>
      </FilterChips>,
    );
    const item = screen.getByRole('button', { name: 'First' });
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveAttribute('tabindex', '-1');
    fireEvent.click(item);
    fireEvent.keyDown(item, { key: ' ' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps standalone Chips independent and forwards Item ref to its focusable element', () => {
    const onClick = vi.fn();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <>
        <FilterChips value={['first']}>
          <FilterChips.Item id="first" ref={itemRef}>
            First
          </FilterChips.Item>
        </FilterChips>
        <Chips id="standalone" selected={false} onClick={onClick}>
          Standalone
        </Chips>
      </>,
    );
    expect(itemRef.current).toBe(screen.getByRole('button', { name: 'First' }));
    const standalone = screen.getByRole('button', { name: 'Standalone' });
    fireEvent.click(standalone);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
