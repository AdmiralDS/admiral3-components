import { createRef, useState } from 'react';

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TextArea } from './TextArea';
import { FormItem } from '../FormItem';

const Controlled = () => {
  const [value, setValue] = useState('Initial');
  return <TextArea aria-label="Text" value={value} onChange={(event) => setValue(event.target.value)} showClearIcon />;
};

describe('TextArea', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([
    { mode: 'accept', expected: 'New\nvalue' },
    { mode: 'transform', expected: 'New value' },
    { mode: 'reject', expected: 'Initial' },
  ])(
    'keeps the controlled value, counter and height synchronized when the owner chooses to $mode input',
    ({ mode, expected }) => {
      vi.stubGlobal(
        'ResizeObserver',
        class {
          observe() {}
          disconnect() {}
        },
      );
      vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
        this: HTMLTextAreaElement,
      ) {
        return this.value.split('\n').length * 40;
      });
      const ControlledCounter = () => {
        const [value, setValue] = useState('Initial');
        return (
          <FormItem maxLength={30} counterThreshold={0}>
            <TextArea
              aria-label="Text"
              autoHeight
              value={value}
              onChange={(event) => {
                if (mode !== 'reject')
                  setValue(mode === 'transform' ? event.target.value.replace('\n', ' ') : event.target.value);
              }}
            />
          </FormItem>
        );
      };
      render(<ControlledCounter />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveStyle({ height: '40px' });
      fireEvent.change(textarea, { target: { value: 'New\nvalue' } });
      expect(textarea).toHaveValue(expected);
      expect(screen.getByText(`${expected.length} / 30`)).toBeInTheDocument();
      expect(textarea).toHaveStyle({ height: mode === 'accept' ? '80px' : '40px' });
      fireEvent.change(textarea, { target: { value: 'Hi' } });
      expect(textarea).toHaveValue(mode === 'reject' ? 'Initial' : 'Hi');
      expect(screen.getByText(`${mode === 'reject' ? 7 : 2} / 30`)).toBeInTheDocument();
      expect(textarea).toHaveStyle({ height: '40px' });
    },
  );

  it('forwards ref and native attributes to textarea, and container props to its container', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const containerRef = createRef<HTMLDivElement>();
    render(
      <TextArea
        ref={ref}
        containerRef={containerRef}
        containerProps={{ 'data-testid': 'container' }}
        aria-label="Text"
        name="message"
        required
        maxLength={20}
        defaultValue="Hello"
      />,
    );
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveValue('Hello');
    expect(ref.current).toHaveAttribute('name', 'message');
    expect(ref.current).toHaveAttribute('required');
    expect(ref.current).toHaveAttribute('maxlength', '20');
    expect(containerRef.current).toBe(screen.getByTestId('container'));
    expect(containerRef.current).toHaveAttribute('data-dimension', 'm');
  });

  it('clears uncontrolled values through a native event, reports onChange and restores focus', () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(<TextArea aria-label="Text" defaultValue="Hello" showClearIcon onChange={onChange} onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('textbox')).toHaveFocus();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('clears a controlled value through the owner onChange', () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it.each([{ disabled: true }, { readOnly: true }])('does not render clear action for %o', (props) => {
    render(<TextArea aria-label="Text" defaultValue="Hello" showClearIcon {...props} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('inherits FormItem settings and reports counts after changes and form reset', async () => {
    render(
      <form data-testid="form">
        <FormItem htmlFor="text" label="Text" maxLength={10} counterThreshold={0} dimension="s" status="error" required>
          <TextArea id="text" defaultValue="Hello" containerProps={{ 'data-testid': 'container' }} />
        </FormItem>
      </form>,
    );
    expect(screen.getByLabelText('Text', { exact: false })).toHaveAttribute('required');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10');
    expect(screen.getByTestId('container')).toHaveAttribute('data-dimension', 's');
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hi' } });
    expect(screen.getByText('2 / 10')).toBeInTheDocument();
    act(() => (screen.getByTestId('form') as HTMLFormElement).reset());
    await waitFor(() => expect(screen.getByText('5 / 10')).toBeInTheDocument());
  });

  it('preserves explicit false settings from FormItem', () => {
    render(
      <FormItem disabled={false} readOnly={false} required={false}>
        <TextArea aria-label="Text" disabled readOnly required />
      </FormItem>,
    );
    expect(screen.getByRole('textbox')).not.toBeDisabled();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('readonly');
    expect(screen.getByRole('textbox')).not.toHaveAttribute('required');
  });

  it('copies the current readOnly value and prioritizes copy over clear', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    render(<TextArea aria-label="Text" defaultValue="Hello" readOnly showClearIcon showCopyIcon />);
    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Копировать текст' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('Hello'));
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });
});
