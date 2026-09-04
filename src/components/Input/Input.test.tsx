import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import styled from 'styled-components';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { INPUT_APPEARANCES, INPUT_DIMENSIONS, INPUT_DIMENSION_PARAMETERS } from './constants';
import { Input } from './Input';
import { InputIconInformer } from '../HelperComponents/InputIconInformer';

const PointerIcon = styled.span`
  cursor: pointer;
`;

describe('Input', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a native text input', () => {
    render(<Input data-testid="input" placeholder="Input" />);

    const component = screen.getByTestId('input');

    expect(component).not.toHaveAttribute('type');
    expect(component).toHaveProperty('type', 'text');
    expect(component).toHaveAttribute('placeholder', 'Input');
  });

  it('renders a native password input', () => {
    render(<Input data-testid="input" type="password" />);

    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
  });

  it('forwards native input attributes', () => {
    render(<Input data-testid="input" title="Input" />);

    const component = screen.getByTestId('input');

    expect(component).toHaveAttribute('data-testid', 'input');
    expect(component).toHaveAttribute('title', 'Input');
  });

  it('shows the full value in a native title when the input text overflows', () => {
    render(<Input data-testid="input" defaultValue="Overflowed input value" />);

    const input = screen.getByTestId('input');
    Object.defineProperties(input, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    });

    fireEvent.mouseEnter(input);

    expect(input).toHaveAttribute('title', 'Overflowed input value');

    fireEvent.mouseLeave(input);

    expect(input).not.toHaveAttribute('title');
  });

  it('renders an overflowed value with an ellipsis', () => {
    render(<Input data-testid="input" defaultValue="Overflowed input value" />);

    expect(screen.getByTestId('input')).toHaveStyle({
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
  });

  it('does not add a native title when the text fits or showTooltip is false', () => {
    const { rerender } = render(<Input data-testid="input" defaultValue="Input value" />);

    const input = screen.getByTestId('input');
    Object.defineProperties(input, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 100 },
    });

    fireEvent.mouseEnter(input);
    expect(input).not.toHaveAttribute('title');

    rerender(<Input data-testid="input" defaultValue="Input value" showTooltip={false} />);
    Object.defineProperties(input, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    });

    fireEvent.mouseEnter(input);
    expect(input).not.toHaveAttribute('title');
  });

  it('forwards ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input ref={ref} data-testid="input" />);

    expect(ref.current).toBe(screen.getByTestId('input'));
  });

  it('forwards containerProps and containerRef to the root container without changing the input contract', () => {
    const inputRef = createRef<HTMLInputElement>();
    const containerRef = createRef<HTMLDivElement>();
    const onContainerClick = vi.fn();

    render(
      <Input
        ref={inputRef}
        containerRef={containerRef}
        containerProps={{
          'aria-label': 'Контейнер поля',
          'data-testid': 'input-container',
          onClick: onContainerClick,
        }}
        data-testid="input"
      />,
    );

    const input = screen.getByTestId('input');
    const container = screen.getByTestId('input-container');

    expect(inputRef.current).toBe(input);
    expect(containerRef.current).toBe(container);
    expect(container).toHaveAttribute('aria-label', 'Контейнер поля');
    expect(input).not.toHaveAttribute('aria-label', 'Контейнер поля');

    fireEvent.click(container);
    expect(onContainerClick).toHaveBeenCalledOnce();
  });

  it('keeps internal container state attributes consistent when containerProps contain conflicting values', () => {
    render(
      <Input
        disabled
        containerProps={{ 'data-disabled': undefined, 'data-dimension': 'custom' }}
        data-testid="input"
      />,
    );

    const container = screen.getByTestId('input').parentElement;

    expect(container).toHaveAttribute('data-disabled', '');
    expect(container).toHaveAttribute('data-dimension', 'm');
  });

  it.each(INPUT_DIMENSIONS)('applies the %s dimension without forwarding it to the DOM', (dimension) => {
    render(<Input data-testid="input" dimension={dimension} />);

    const component = screen.getByTestId('input');
    const container = component.parentElement;

    expect(container).toHaveStyle({
      height: `${INPUT_DIMENSION_PARAMETERS[dimension].containerHeight}px`,
    });
    expect(container).toHaveStyle(
      `--admiral-input-padding-block: ${INPUT_DIMENSION_PARAMETERS[dimension].paddingBlock}px`,
    );
    expect(container).toHaveStyle(
      `--admiral-input-padding-inline: ${INPUT_DIMENSION_PARAMETERS[dimension].paddingInline}px`,
    );
    expect(container).toHaveStyle(
      `--admiral-input-divider-length: ${INPUT_DIMENSION_PARAMETERS[dimension].dividerLength}px`,
    );
    expect(component).not.toHaveAttribute('dimension');
    expect(container).toHaveAttribute('data-dimension', dimension);
  });

  it.each(INPUT_APPEARANCES)('applies the %s appearance to the container', (appearance) => {
    render(<Input data-testid="input" appearance={appearance} />);

    expect(screen.getByTestId('input').parentElement).toHaveAttribute('data-appearance', appearance);
  });

  it('keeps before and after icon panels in the normal input flow', () => {
    render(
      <Input
        data-testid="input"
        iconsBefore={<span data-testid="before-icon" />}
        iconsAfter={<button data-testid="after-icon" type="button" />}
      />,
    );

    const input = screen.getByTestId('input');
    const container = input.parentElement;

    expect(container?.children).toHaveLength(4);
    expect(container?.children[0]).toContainElement(screen.getByTestId('before-icon'));
    expect(container?.children[1]).toBe(input);
    expect(container?.children[2]).toContainElement(screen.getByTestId('after-icon'));
    expect(container?.children[3]).toHaveAttribute('data-role', 'input-border');
  });

  it.each([false, true, null, undefined, ''])(
    'does not render wrappers, dividers or spacing for empty slot value %s',
    (emptySlotValue) => {
      render(
        <Input
          data-testid="input"
          iconsBefore={emptySlotValue}
          iconsAfter={emptySlotValue}
          prefix={emptySlotValue}
          suffix={emptySlotValue}
        />,
      );

      const container = screen.getByTestId('input').parentElement;

      expect(container?.children).toHaveLength(2);
      expect(container?.querySelector('[data-role="icon-panel-before"]')).not.toBeInTheDocument();
      expect(container?.querySelector('[data-role="icon-panel-after"]')).not.toBeInTheDocument();
      expect(container?.querySelector('[data-orientation="vertical"]')).not.toBeInTheDocument();
    },
  );

  it.each([0, 'Slot content'])('renders valid slot value %s with its wrappers and dividers', (slotValue) => {
    render(
      <Input
        data-testid="input"
        iconsBefore={slotValue}
        iconsAfter={slotValue}
        prefix={slotValue}
        suffix={slotValue}
      />,
    );

    const container = screen.getByTestId('input').parentElement;

    expect(container?.children).toHaveLength(8);
    expect(container?.querySelector('[data-role="icon-panel-before"]')).toHaveTextContent(String(slotValue));
    expect(container?.querySelector('[data-role="icon-panel-after"]')).toHaveTextContent(String(slotValue));
    expect(container?.querySelectorAll('[data-orientation="vertical"]')).toHaveLength(2);
  });

  it('renders the clear icon button before custom and primary after icons', () => {
    render(
      <Input
        data-testid="input"
        defaultValue="Value"
        showClearIcon
        iconsAfter={
          <>
            <span data-testid="custom-icon" />
            <span data-testid="primary-icon" />
          </>
        }
      />,
    );

    const panel = screen.getByTestId('input').nextElementSibling;
    const clearButton = screen.getByRole('button', { name: 'Очистить поле' });

    expect(panel).toHaveAttribute('data-role', 'icon-panel-after');
    expect(panel?.children[0]).toBe(clearButton);
    expect(panel?.children[1]).toBe(screen.getByTestId('custom-icon'));
    expect(panel?.children[2]).toBe(screen.getByTestId('primary-icon'));
    expect(clearButton).toHaveAttribute('type', 'button');
    expect(clearButton.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the clear icon button only while an uncontrolled input has a value', () => {
    render(<Input data-testid="input" showClearIcon />);

    const input = screen.getByTestId('input');

    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Value' } });

    expect(screen.getByRole('button', { name: 'Очистить поле' })).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '' } });

    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
  });

  it('updates the clear icon button visibility from the controlled value', () => {
    const { rerender } = render(<Input value="Value" showClearIcon onChange={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Очистить поле' })).toBeInTheDocument();

    rerender(<Input value="" showClearIcon onChange={() => undefined} />);

    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
  });

  it('clears the value, emits a change event and restores input focus', () => {
    const onChange = vi.fn();

    render(<Input data-testid="input" defaultValue="Value" showClearIcon onChange={onChange} />);

    const input = screen.getByTestId('input');
    fireEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));

    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledOnce();
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
  });

  it.each(['disabled', 'readOnly'] as const)('hides the clear icon button when the input is %s', (state) => {
    render(<Input defaultValue="Value" showClearIcon {...{ [state]: true }} />);

    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
  });

  it('keeps user icons visible when the input is readOnly', () => {
    render(
      <Input
        defaultValue="Value"
        readOnly
        showClearIcon
        iconsBefore={<span data-testid="before-icon" />}
        iconsAfter={
          <>
            <span data-testid="after-icon" />
            <InputIconInformer data-testid="informer-icon" title="Дополнительная информация" />
          </>
        }
      />,
    );

    expect(screen.getByTestId('before-icon')).toBeVisible();
    expect(screen.getByTestId('after-icon')).toBeVisible();
    expect(screen.getByTestId('informer-icon')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
  });

  it('leaves user icon availability under consumer control', () => {
    render(
      <Input
        disabled
        iconsAfter={
          <>
            <button type="button">Доступное пользовательское действие</button>
            <button type="button" disabled>
              Недоступное пользовательское действие
            </button>
          </>
        }
      />,
    );

    expect(screen.getByRole('button', { name: 'Доступное пользовательское действие' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Недоступное пользовательское действие' })).toBeDisabled();
  });

  it('reflects status and native disabled/readOnly semantics', () => {
    const { rerender } = render(<Input data-testid="input" status="error" disabled />);

    const input = screen.getByTestId('input');

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.parentElement).toHaveAttribute('data-disabled');
    expect(input.parentElement).toHaveAttribute('data-status', 'error');

    rerender(<Input data-testid="input" readOnly />);

    expect(input).toHaveAttribute('readonly');
    expect(input.parentElement).toHaveAttribute('data-read-only');
  });

  it('selects the readOnly value when focus does not originate from a pointer', () => {
    render(<Input data-testid="input" defaultValue="Read only value" readOnly />);

    const input = screen.getByTestId('input') as HTMLInputElement;
    input.setSelectionRange(4, 4);

    fireEvent.focus(input);

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  it('keeps the native selection when a readOnly input receives pointer focus', () => {
    render(<Input data-testid="input" defaultValue="Read only value" readOnly />);

    const input = screen.getByTestId('input') as HTMLInputElement;
    input.setSelectionRange(4, 4);

    fireEvent.pointerDown(input);
    fireEvent.focus(input);

    expect(input.selectionStart).toBe(4);
    expect(input.selectionEnd).toBe(4);
  });

  it('shows the not-allowed cursor over the whole disabled surface', () => {
    render(
      <Input
        data-testid="input"
        disabled
        iconsBefore={<PointerIcon data-testid="before-icon" />}
        iconsAfter={<PointerIcon data-testid="after-icon" />}
      />,
    );

    const input = screen.getByTestId('input');
    const container = input.parentElement;

    expect(container).toHaveStyle({ cursor: 'not-allowed' });
    expect(input).toHaveStyle({ cursor: 'not-allowed' });
    expect(screen.getByTestId('before-icon')).toHaveStyle({ cursor: 'not-allowed' });
    expect(screen.getByTestId('after-icon')).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('limits the text cursor to the full-height native input zone', () => {
    render(
      <Input
        data-testid="input"
        prefix={<span data-testid="prefix">Prefix</span>}
        iconsBefore={<PointerIcon data-testid="before-icon" />}
        iconsAfter={<PointerIcon data-testid="after-icon" />}
        suffix={<span data-testid="suffix">Suffix</span>}
      />,
    );

    const input = screen.getByTestId('input');
    const container = input.parentElement;

    expect(container).toHaveStyle({ cursor: 'default' });
    expect(input).toHaveStyle({ cursor: 'text', height: '100%' });
    expect(screen.getByTestId('prefix')).not.toHaveStyle({ cursor: 'text' });
    expect(screen.getByTestId('before-icon')).toHaveStyle({ cursor: 'pointer' });
    expect(screen.getByTestId('after-icon')).toHaveStyle({ cursor: 'pointer' });
    expect(screen.getByTestId('suffix')).not.toHaveStyle({ cursor: 'text' });
  });
});
