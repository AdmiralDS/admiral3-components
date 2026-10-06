import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CloseIconPlacementButton, IconPlacement } from './index';

describe('IconPlacement', () => {
  afterEach(cleanup);

  it('renders a native button and forwards its ref and children', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconPlacement ref={ref} aria-label="Действие">
        <svg aria-hidden data-testid="icon" />
      </IconPlacement>,
    );
    const button = screen.getByRole('button', { name: 'Действие' });

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeEnabled();
    expect(ref.current).toBe(button);
    expect(button).toContainElement(screen.getByTestId('icon'));
  });

  it.each(['button', 'submit', 'reset'] as const)('supports the native %s button type', (type) => {
    render(<IconPlacement type={type} aria-label="Действие" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', type);
  });

  it('forwards DOM attributes and accessibility attributes', () => {
    render(
      <IconPlacement
        aria-label="Действие"
        aria-describedby="hint"
        id="action"
        className="custom-button"
        title="Подсказка"
        tabIndex={-1}
        name="action"
        value="remove"
        data-testid="action"
      />,
    );
    const button = screen.getByTestId('action');

    expect(button).toHaveAttribute('aria-describedby', 'hint');
    expect(button).toHaveAttribute('id', 'action');
    expect(button).toHaveClass('custom-button');
    expect(button).toHaveAttribute('title', 'Подсказка');
    expect(button).toHaveAttribute('tabindex', '-1');
    expect(button).toHaveAttribute('name', 'action');
    expect(button).toHaveAttribute('value', 'remove');
  });

  it('does not forward internal variant and activation props to the DOM', () => {
    render(<IconPlacement dimension="xs" colorMode={{ iconColor: 'rebeccapurple' }} disableKeyboardActivation />);
    const button = screen.getByRole('button');

    for (const attribute of ['dimension', 'colorMode', 'disableKeyboardActivation', '$dimension', '$colorMode']) {
      expect(button).not.toHaveAttribute(attribute);
    }
  });

  it('forwards a pointer click to onClick', () => {
    const onClick = vi.fn();
    render(<IconPlacement onClick={onClick} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0].type).toBe('click');
    expect(onClick.mock.calls[0][0].target).toBe(button);
  });

  it('blocks native clicks when disabled', () => {
    const onClick = vi.fn();
    render(<IconPlacement disabled onClick={onClick} />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    fireEvent.click(button);
    button.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'does not forward keydown when disabled and disableKeyboardActivation is %s',
    (customHandling) => {
      const onKeyDown = vi.fn();
      render(<IconPlacement disabled disableKeyboardActivation={customHandling} onKeyDown={onKeyDown} />);
      const button = screen.getByRole('button');

      for (const key of ['Enter', ' ', 'Escape']) fireEvent.keyDown(button, { key });

      expect(onKeyDown).not.toHaveBeenCalled();
    },
  );

  it('restores click activation when disabled is removed', () => {
    const onClick = vi.fn();
    const { rerender } = render(<IconPlacement disabled onClick={onClick} />);

    rerender(<IconPlacement onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each([
    ['Enter', undefined],
    [' ', undefined],
    ['Enter', false],
    [' ', false],
  ] as const)('prevents the default action of %j when disableKeyboardActivation is %s', (key, customHandling) => {
    const onClick = vi.fn();
    render(<IconPlacement disableKeyboardActivation={customHandling} onClick={onClick} />);

    // fireEvent does not synthesize the browser's native keyboard click.
    expect(fireEvent.keyDown(screen.getByRole('button'), { key })).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    ['Enter', undefined],
    [' ', undefined],
    ['Enter', false],
    [' ', false],
  ] as const)(
    'forwards %j exactly once with defaultPrevented when disableKeyboardActivation is %s',
    (key, customHandling) => {
      const onKeyDown = vi.fn();
      render(<IconPlacement disableKeyboardActivation={customHandling} onKeyDown={onKeyDown} />);

      fireEvent.keyDown(screen.getByRole('button'), { key });

      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyDown.mock.calls[0][0].key).toBe(key);
      expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(true);
    },
  );

  it.each(['Enter', ' '])('does not prevent the default action of %j when disableKeyboardActivation is true', (key) => {
    const onClick = vi.fn();
    render(<IconPlacement disableKeyboardActivation onClick={onClick} />);

    expect(fireEvent.keyDown(screen.getByRole('button'), { key })).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(['Enter', ' ', 'Escape', 'ArrowRight', 'Backspace'])(
    'forwards %j unchanged exactly once when disableKeyboardActivation is true',
    (key) => {
      const onClick = vi.fn();
      const onKeyDown = vi.fn();
      render(<IconPlacement disableKeyboardActivation onClick={onClick} onKeyDown={onKeyDown} />);

      expect(fireEvent.keyDown(screen.getByRole('button'), { key })).toBe(true);

      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyDown.mock.calls[0][0].key).toBe(key);
      expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(false);
      expect(onClick).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['Escape', undefined],
    ['ArrowRight', undefined],
    ['Backspace', undefined],
    ['Escape', false],
    ['ArrowRight', false],
    ['Backspace', false],
  ] as const)('does not forward %s when disableKeyboardActivation is %s', (key, customHandling) => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(<IconPlacement disableKeyboardActivation={customHandling} onClick={onClick} onKeyDown={onKeyDown} />);

    expect(fireEvent.keyDown(screen.getByRole('button'), { key })).toBe(true);
    expect(onKeyDown).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('lets the user prevent the default action when disableKeyboardActivation is true', () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <IconPlacement
        disableKeyboardActivation
        onClick={onClick}
        onKeyDown={(event) => {
          event.preventDefault();
          onKeyDown(event);
        }}
      />,
    );

    expect(fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' })).toBe(false);
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'allows pointer and programmatic clicks when disableKeyboardActivation is %s',
    (customHandling) => {
      const onClick = vi.fn();
      render(<IconPlacement disableKeyboardActivation={customHandling} onClick={onClick} />);
      const button = screen.getByRole('button');

      expect(button).toBeEnabled();
      fireEvent.click(button);
      button.click();
      expect(onClick).toHaveBeenCalledTimes(2);
      for (const [event] of onClick.mock.calls) expect(event.type).toBe('click');
    },
  );

  it('restores built-in default-action prevention when disableKeyboardActivation is removed', () => {
    const { rerender } = render(<IconPlacement disableKeyboardActivation />);
    expect(fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })).toBe(true);

    rerender(<IconPlacement />);

    expect(fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })).toBe(false);
  });
});

describe('CloseIconPlacementButton', () => {
  afterEach(cleanup);

  it('forwards its ref and accessible name and keeps the close icon decorative', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<CloseIconPlacementButton ref={ref} aria-label="Удалить фильтр" className="custom-close" />);
    const button = screen.getByRole('button', { name: 'Удалить фильтр' });

    expect(ref.current).toBe(button);
    expect(button).toHaveClass('close-button', 'custom-close');
    expect(button).toHaveAttribute('type', 'button');
    expect(button.querySelectorAll('svg')).toHaveLength(1);
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the close icon when no custom class is provided', () => {
    render(<CloseIconPlacementButton aria-label="Удалить" />);
    expect(screen.getByRole('button')).toHaveClass('close-button');
    expect(screen.getByRole('button')).not.toHaveClass('undefined');
  });

  it('forwards clicks from the close icon', () => {
    const onClick = vi.fn();
    render(<CloseIconPlacementButton onClick={onClick} aria-label="Удалить" />);
    fireEvent.click(screen.getByRole('button').querySelector('svg')!);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('blocks native clicks when disabled', () => {
    const onClick = vi.fn();
    render(<CloseIconPlacementButton disabled onClick={onClick} aria-label="Удалить" />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    fireEvent.click(button.querySelector('svg')!);
    button.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    ['Enter', false, true],
    [' ', false, true],
    ['Enter', true, false],
    [' ', true, false],
  ] as const)(
    'handles %j with disableKeyboardActivation=%s and defaultPrevented=%s',
    (key, customHandling, prevented) => {
      const onClick = vi.fn();
      const onKeyDown = vi.fn();
      render(
        <CloseIconPlacementButton
          disableKeyboardActivation={customHandling}
          onClick={onClick}
          onKeyDown={onKeyDown}
          aria-label="Удалить"
        />,
      );

      expect(fireEvent.keyDown(screen.getByRole('button'), { key })).toBe(!prevented);
      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyDown.mock.calls[0][0].key).toBe(key);
      expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(prevented);
      expect(onClick).not.toHaveBeenCalled();
    },
  );
});
