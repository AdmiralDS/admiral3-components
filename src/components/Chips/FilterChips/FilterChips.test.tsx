import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as overflowUtils from '#src/utils/checkOverflow';

import { SelectableChip } from '../SelectableChip';
import { FilterChips } from './FilterChips';

describe('FilterChips', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('reuses SelectableChip tooltip behavior', () => {
    vi.spyOn(overflowUtils, 'checkOverflow').mockReturnValue(true);
    render(
      <FilterChips value={[]}>
        <FilterChips.Item value="first" data-testid="first" renderContentTooltip={() => 'Filter tooltip'}>
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
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
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

  it('calls the Item onClick once before selection with the same event', () => {
    const onClick = vi.fn();
    const onChange = vi.fn();
    render(
      <FilterChips onChange={onChange}>
        <FilterChips.Item value="first" onClick={onClick}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    fireEvent.click(first);
    expect(onClick).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ target: first }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(onClick.mock.calls[0][0], ['first']);
    expect(onClick.mock.invocationCallOrder[0]).toBeLessThan(onChange.mock.invocationCallOrder[0]);
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it('allows the Item onClick to cancel selection with preventDefault', () => {
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const onChange = vi.fn();
    render(
      <FilterChips defaultValue={['first']} onChange={onChange}>
        <FilterChips.Item value="first" onClick={onClick}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    expect(fireEvent.click(first)).toBe(false);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it.each(['item disabled', 'item readOnly', 'group disabled'])('blocks the Item onClick when %s', (state) => {
    const onClick = vi.fn();
    const onChange = vi.fn();
    render(
      <FilterChips disabled={state === 'group disabled'} onChange={onChange}>
        <FilterChips.Item
          value="first"
          disabled={state === 'item disabled'}
          readOnly={state === 'item readOnly'}
          onClick={onClick}
        >
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    fireEvent.click(first);
    first.click();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(first).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects with Space without synthesizing a click for the Item onClick', () => {
    const onClick = vi.fn();
    const onChange = vi.fn();
    render(
      <FilterChips onChange={onChange}>
        <FilterChips.Item value="first" onClick={onClick}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    fireEvent.keyDown(first, { key: ' ' });
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), ['first']);
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps multiple selection internally when value is omitted', () => {
    const onChange = vi.fn();
    const renderGroup = (defaultValue: string[]) => (
      <FilterChips defaultValue={defaultValue} onChange={onChange}>
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
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
        <FilterChips.Item value="first">First</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    expect(first).toHaveAttribute('aria-pressed', 'false');
    fireEvent.keyDown(first, { key: ' ' });
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses explicit Item values independently of DOM ids and content', () => {
    const onChange = vi.fn();
    const renderGroup = (value: string[]) => (
      <FilterChips value={value} onChange={onChange}>
        <FilterChips.Item id="mars-chip" value="mars">
          Марс
        </FilterChips.Item>
        <FilterChips.Item value="venus">
          <span>Венера</span>
        </FilterChips.Item>
        <FilterChips.Item value="zero">{0}</FilterChips.Item>
      </FilterChips>
    );
    const { rerender } = render(renderGroup([]));

    const mars = screen.getByRole('button', { name: 'Марс' });
    expect(mars).toHaveAttribute('id', 'mars-chip');
    expect(mars).not.toHaveAttribute('value');
    fireEvent.click(mars);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['mars']);

    rerender(renderGroup(['mars']));
    expect(screen.getByRole('button', { name: 'Марс' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Венера' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['mars', 'venus']);

    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['mars', 'zero']);
  });

  it('allows identical content when Item values are different', () => {
    const onChange = vi.fn();
    const renderGroup = (value: string[]) => (
      <FilterChips value={value} onChange={onChange}>
        <FilterChips.Item value="first">Planet</FilterChips.Item>
        <FilterChips.Item value="second">Planet</FilterChips.Item>
      </FilterChips>
    );
    const { rerender } = render(renderGroup([]));
    const [first, second] = screen.getAllByRole('button', { name: 'Planet' });

    fireEvent.click(second);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), ['second']);
    rerender(renderGroup(['second']));
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(second).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports an empty string value in selection and keyboard navigation', () => {
    const onChange = vi.fn();
    render(
      <FilterChips defaultValue={['second']} onChange={onChange}>
        <FilterChips.Item value="">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    second.focus();
    fireEvent.keyDown(second, { key: 'ArrowLeft' });
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(first, { key: ' ' });
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['second', '']);
    expect(first).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();
  });

  it('selects only with Space and allows clearing the exclusive selection', () => {
    const onChange = vi.fn();
    const renderGroup = (value: string | null) => (
      <FilterChips exclusive value={value} onChange={onChange}>
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
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
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
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

  it.each([
    { exclusive: false, selected: false },
    { exclusive: false, selected: true },
    { exclusive: true, selected: false },
    { exclusive: true, selected: true },
  ])('prevents Enter activation without changing selection with %j', ({ exclusive, selected }) => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const selectionProps = exclusive
      ? { exclusive: true as const, defaultValue: selected ? 'first' : null }
      : { defaultValue: selected ? ['first'] : [] };
    render(
      <FilterChips {...selectionProps} onChange={onChange}>
        <FilterChips.Item value="first" onClick={onClick} onKeyDown={onKeyDown}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    expect(fireEvent.keyDown(first, { key: 'Enter' })).toBe(false);
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(first).toHaveAttribute('aria-pressed', String(selected));
  });

  it.each([false, true])('allows onKeyDown to cancel Space when selected is %j', (selected) => {
    const onChange = vi.fn();
    const onKeyDown = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <FilterChips defaultValue={selected ? ['first'] : []} onChange={onChange}>
        <FilterChips.Item value="first" onKeyDown={onKeyDown}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    expect(fireEvent.keyDown(first, { key: ' ' })).toBe(false);
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
    expect(first).toHaveAttribute('aria-pressed', String(selected));
  });

  it('allows onKeyDownCapture to cancel selection before the Item keyboard handler', () => {
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    const onKeyDownCapture = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <FilterChips onChange={onChange}>
        <FilterChips.Item value="first" onKeyDown={onKeyDown} onKeyDownCapture={onKeyDownCapture}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    expect(fireEvent.keyDown(first, { key: ' ' })).toBe(false);
    expect(onKeyDownCapture).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(true);
    expect(onKeyDownCapture.mock.invocationCallOrder[0]).toBeLessThan(onKeyDown.mock.invocationCallOrder[0]);
    expect(onChange).not.toHaveBeenCalled();
    expect(first).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange once for one Space press', () => {
    const onChange = vi.fn();
    render(
      <FilterChips onChange={onChange}>
        <FilterChips.Item value="first">First</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    fireEvent.keyDown(first, { key: ' ' });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), ['first']);
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it.each(['Enter', ' '])('bubbles %j to the group keyboard handler', (key) => {
    const onKeyDown = vi.fn();
    render(
      <FilterChips onKeyDown={onKeyDown}>
        <FilterChips.Item value="first">First</FilterChips.Item>
      </FilterChips>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'First' }), { key });
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it('focuses the SelectableChip root when its content is clicked', () => {
    const onChange = vi.fn();
    render(
      <FilterChips value={[]} onChange={onChange}>
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
      </FilterChips>,
    );
    const second = screen.getByRole('button', { name: 'Second' });

    expect(second).toHaveAttribute('tabindex', '-1');
    fireEvent.click(screen.getByText('Second'));

    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabindex', '-1');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), ['second']);
    expect(second).toHaveAttribute('aria-pressed', 'false');
  });

  it.each(['Enter', ' '])('calls the Item keyboard handler once for %j without a second activation', (key) => {
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <FilterChips onChange={onChange}>
        <FilterChips.Item value="first" onKeyDown={onKeyDown}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    expect(fireEvent.keyDown(first, { key })).toBe(false);
    expect(onKeyDown).toHaveBeenCalledOnce();
    if (key === ' ') {
      expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), ['first']);
      expect(onKeyDown.mock.invocationCallOrder[0]).toBeLessThan(onChange.mock.invocationCallOrder[0]);
    } else {
      expect(onChange).not.toHaveBeenCalled();
    }
  });

  it('rejects duplicate Item values, including disabled items', () => {
    expect(() =>
      render(
        <FilterChips>
          <FilterChips.Item id="first-chip" value="same">
            First
          </FilterChips.Item>
          <FilterChips.Item id="second-chip" value="same" disabled>
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
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
        <FilterChips.Item value="third">Third</FilterChips.Item>
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

  it('keeps the focused Item tabbable when focus moves inside the group and calls capture handlers', () => {
    const onFocusCapture = vi.fn();
    const onBlurCapture = vi.fn();
    render(
      <FilterChips value={['first']} onFocusCapture={onFocusCapture} onBlurCapture={onBlurCapture}>
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    fireEvent.focus(second);
    expect(onFocusCapture).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ target: second }));
    expect(second).toHaveAttribute('tabindex', '0');
    expect(first).toHaveAttribute('tabindex', '-1');

    fireEvent.blur(second, { relatedTarget: first });
    expect(onBlurCapture).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ target: second, relatedTarget: first }),
    );
    expect(second).toHaveAttribute('tabindex', '0');
    expect(first).toHaveAttribute('tabindex', '-1');

    fireEvent.focus(first, { relatedTarget: second });
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    expect(onFocusCapture).toHaveBeenCalledTimes(2);
  });

  it.each(['outside element', 'null'])('restores the selected Tab stop on blur to %s', (destination) => {
    const onBlurCapture = vi.fn();
    render(
      <FilterChips value={['second']} onBlurCapture={onBlurCapture}>
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    const relatedTarget = destination === 'null' ? null : document.body;

    fireEvent.focus(first);
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    fireEvent.blur(first, { relatedTarget });
    expect(onBlurCapture).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ target: first, relatedTarget }));
    expect(second).toHaveAttribute('tabindex', '0');
    expect(first).toHaveAttribute('tabindex', '-1');
  });

  it('updates selection and the navigation registry when an Item value changes', () => {
    const onChange = vi.fn();
    const renderGroup = (itemValue: string) => (
      <FilterChips value={['updated']} onChange={onChange}>
        <FilterChips.Item key="first" value={itemValue}>
          First
        </FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
      </FilterChips>
    );
    const { rerender } = render(renderGroup('first'));
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    expect(first).toHaveAttribute('aria-pressed', 'false');

    rerender(renderGroup('updated'));
    expect(first).toHaveAttribute('aria-pressed', 'true');
    fireEvent.focus(second);
    fireEvent.keyDown(second, { key: 'ArrowLeft' });
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(first, { key: ' ' });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), []);
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();
  });

  it('updates the navigation registry when an Item is removed', () => {
    const removedRef = createRef<HTMLDivElement>();
    const renderGroup = (withThird: boolean) => (
      <FilterChips>
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
        {withThird && (
          <FilterChips.Item value="third" ref={removedRef}>
            Third
          </FilterChips.Item>
        )}
      </FilterChips>
    );
    const { rerender } = render(renderGroup(true));
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    fireEvent.keyDown(first, { key: 'End' });
    expect(removedRef.current).toHaveFocus();
    rerender(renderGroup(false));
    expect(removedRef.current).toBeNull();
    expect(screen.queryByRole('button', { name: 'Third' })).not.toBeInTheDocument();
    expect(first).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(first, { key: 'End' });
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(second, { key: 'ArrowRight' });
    expect(first).toHaveFocus();
  });

  it('lets a group keyboard handler cancel navigation', () => {
    const onKeyDown = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <FilterChips onKeyDown={onKeyDown}>
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="second">Second</FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    fireEvent.focus(first);

    expect(fireEvent.keyDown(first, { key: 'ArrowRight' })).toBe(false);
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(first).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it.each([{ disabled: true }, { readOnly: true }])('blocks selection and Item keyboard callbacks with %j', (state) => {
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    const onKeyDownCapture = vi.fn();
    render(
      <FilterChips defaultValue={['first']} onChange={onChange}>
        <FilterChips.Item value="first" {...state} onKeyDown={onKeyDown} onKeyDownCapture={onKeyDownCapture}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );
    const first = screen.getByRole('button', { name: 'First' });

    fireEvent.click(first);
    first.click();
    for (const key of [' ', 'Enter', 'ArrowRight']) fireEvent.keyDown(first, { key });
    expect(onChange).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();
    expect(onKeyDownCapture).not.toHaveBeenCalled();
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it('leaves standalone SelectableChip and other children outside group navigation', () => {
    const onClick = vi.fn();
    render(
      <FilterChips aria-label="Independent filters">
        <SelectableChip selected onClick={onClick}>
          First
        </SelectableChip>
        <SelectableChip selected={false} onClick={onClick}>
          Second
        </SelectableChip>
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
        <FilterChips.Item value="first">First</FilterChips.Item>
        <SelectableChip selected={false}>Independent</SelectableChip>
        <FilterChips.Item value="second">Second</FilterChips.Item>
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
        <FilterChips.Item value="first">First</FilterChips.Item>
        <FilterChips.Item value="disabled" disabled>
          Disabled
        </FilterChips.Item>
        <FilterChips.Item value="readonly" readOnly>
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
        <FilterChips.Item value="first">First</FilterChips.Item>
      </FilterChips>,
    );
    const item = screen.getByRole('button', { name: 'First' });
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveAttribute('tabindex', '-1');
    fireEvent.click(item);
    fireEvent.keyDown(item, { key: ' ' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('runs callback ref cleanup when the Item is unmounted', () => {
    const cleanupRef = vi.fn();
    const ref = vi.fn((node: HTMLDivElement | null) => (node ? cleanupRef : undefined));
    const { unmount } = render(
      <FilterChips>
        <FilterChips.Item value="first" ref={ref}>
          First
        </FilterChips.Item>
      </FilterChips>,
    );

    expect(ref).toHaveBeenCalledExactlyOnceWith(screen.getByRole('button', { name: 'First' }));
    unmount();
    expect(cleanupRef).toHaveBeenCalledOnce();
    expect(ref).not.toHaveBeenCalledWith(null);
  });

  it('keeps standalone SelectableChip independent and forwards Item ref to its root', () => {
    const onClick = vi.fn();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <>
        <FilterChips value={['first']}>
          <FilterChips.Item value="first" ref={itemRef}>
            First
          </FilterChips.Item>
        </FilterChips>
        <SelectableChip id="standalone" selected={false} onClick={onClick}>
          Standalone
        </SelectableChip>
      </>,
    );
    expect(itemRef.current).toBe(screen.getByRole('button', { name: 'First' }));
    const standalone = screen.getByRole('button', { name: 'Standalone' });
    fireEvent.click(standalone);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
