import { createRef, forwardRef } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InputIconCopyButton } from './InputIconCopyButton';
import type * as TooltipModule from '../Tooltip';

vi.mock('../Tooltip', async (importOriginal) => {
  const original = await importOriginal<typeof TooltipModule>();
  return {
    ...original,
    Tooltip: forwardRef<HTMLDivElement, React.ComponentProps<typeof original.Tooltip>>(({ children, id }, ref) => (
      <div ref={ref} id={id} role="tooltip">
        {children}
      </div>
    )),
  };
});

describe('InputIconCopyButton', () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('copies an input value, forwards button props and restores the tooltip after two seconds', async () => {
    const inputRef = createRef<HTMLInputElement>();
    const buttonRef = createRef<HTMLButtonElement>();
    render(
      <>
        <input ref={inputRef} defaultValue="Hello" />
        <InputIconCopyButton inputRef={inputRef} ref={buttonRef} preventFocus aria-describedby="description" />
      </>,
    );
    const button = screen.getByRole('button', { name: 'Копировать текст' });
    expect(buttonRef.current).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-prevent-input-focus');
    fireEvent.focus(button);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Копировать текст');
    expect(button).toHaveAttribute('aria-describedby', `description ${screen.getByRole('tooltip').id}`);

    await act(async () => fireEvent.click(button));
    expect(writeText).toHaveBeenCalledWith('Hello');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Скопировано');
    act(() => vi.advanceTimersByTime(1999));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Скопировано');
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Копировать текст');
  });

  it('copies the current value of a readOnly textarea', async () => {
    const inputRef = createRef<HTMLTextAreaElement>();
    render(
      <>
        <textarea ref={inputRef} defaultValue="Initial" readOnly />
        <InputIconCopyButton inputRef={inputRef} />
      </>,
    );
    inputRef.current!.value = 'Current';
    await act(async () => fireEvent.click(screen.getByRole('button')));
    expect(writeText).toHaveBeenCalledWith('Current');
    expect(inputRef.current).toHaveValue('Current');
  });

  it('reports clipboard failure', async () => {
    writeText.mockRejectedValue(new Error('Permission denied'));
    const inputRef = createRef<HTMLInputElement>();
    render(
      <>
        <input ref={inputRef} defaultValue="Hello" />
        <InputIconCopyButton inputRef={inputRef} />
      </>,
    );
    const button = screen.getByRole('button');
    fireEvent.focus(button);
    await act(async () => fireEvent.click(button));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Не удалось скопировать текст');
  });

  it.each(['empty', 'disabled', 'missing'] as const)('does not copy from an %s field', async (state) => {
    const inputRef = createRef<HTMLInputElement>();
    render(
      <>
        {state !== 'missing' && (
          <input ref={inputRef} defaultValue={state === 'empty' ? '' : 'Hello'} disabled={state === 'disabled'} />
        )}
        <InputIconCopyButton inputRef={inputRef} />
      </>,
    );
    await act(async () => fireEvent.click(screen.getByRole('button')));
    expect(writeText).not.toHaveBeenCalled();
  });

  it('allows onClick to cancel copying', async () => {
    const inputRef = createRef<HTMLInputElement>();
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <>
        <input ref={inputRef} defaultValue="Hello" />
        <InputIconCopyButton inputRef={inputRef} onClick={onClick} />
      </>,
    );
    await act(async () => fireEvent.click(screen.getByRole('button')));
    expect(onClick).toHaveBeenCalledOnce();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('does not schedule a message reset if copying finishes after unmount', async () => {
    let finishCopy!: () => void;
    writeText.mockReturnValue(
      new Promise<void>((resolve) => {
        finishCopy = resolve;
      }),
    );
    const inputRef = createRef<HTMLInputElement>();
    const { unmount } = render(
      <>
        <input ref={inputRef} defaultValue="Hello" />
        <InputIconCopyButton inputRef={inputRef} />
      </>,
    );
    fireEvent.click(screen.getByRole('button'));
    unmount();
    await act(async () => finishCopy());
    expect(vi.getTimerCount()).toBe(0);
  });
});
