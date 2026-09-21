import { createRef } from 'react';

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { css, ServerStyleSheet } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { FormItem } from './FormItem';
import { Input } from '../Input';
import { FormItemPlaygroundTemplate } from './stories/FormItemPlayground.template';

describe('FormItem', () => {
  afterEach(cleanup);

  it('keeps labels and descriptions separate when the playground template is rendered twice', () => {
    render(
      <>
        <FormItemPlaygroundTemplate label="First field" description="First hint" children={null} />
        <FormItemPlaygroundTemplate label="Second field" description="Second hint" children={null} />
      </>,
    );

    const first = screen.getByRole('textbox', { name: 'First field' });
    const second = screen.getByRole('textbox', { name: 'Second field' });
    expect(first.id).not.toBe(second.id);
    expect(first).toHaveAccessibleDescription('First hint');
    expect(second).toHaveAccessibleDescription('Second hint');
  });

  it('renders on the server with a resolved required marker color', () => {
    const sheet = new ServerStyleSheet();
    try {
      const markup = renderToString(
        sheet.collectStyles(
          <FormItem label="Server field" htmlFor="server-field" required>
            <input id="server-field" required />
          </FormItem>,
        ),
      );
      expect(markup).toContain('for="server-field"');
      expect(markup).toContain('id="server-field"');
      expect(sheet.getStyleTags()).toMatch(/var\(--admiral-color-error-text-1-rest,\s*#D92020\)/);
    } finally {
      sheet.seal();
    }
  });

  it.each([undefined, null, false, true, ''])('omits the label row for an empty label (%s)', (label) => {
    const { container, unmount } = render(
      <FormItem label={label} description="Explanation" required>
        <input aria-label="Field without a visible label" />
      </FormItem>,
    );
    const item = container.firstElementChild;
    expect(item?.children).toHaveLength(2);
    expect(item?.firstElementChild?.tagName).toBe('INPUT');
    expect(item?.querySelector('label')).toBeNull();
    unmount();
  });

  it('preserves a zero label and an additional label without a main label', () => {
    const { container, rerender, unmount } = render(
      <FormItem label={0}>
        <input />
      </FormItem>,
    );
    expect(container.querySelector('label')).toHaveTextContent('0');
    rerender(
      <FormItem additionalLabel="Additional label">
        <input aria-label="Field without a visible label" />
      </FormItem>,
    );
    expect(container.querySelector('label')).toBeNull();
    expect(container.firstElementChild?.firstElementChild).toHaveTextContent('Additional label');
    unmount();
  });

  it('prioritizes explicit disabled settings over the child control', () => {
    const { container, rerender, unmount } = render(
      <FormItem label="Name" htmlFor="disabled-field" disabled>
        <Input id="disabled-field" />
      </FormItem>,
    );

    const item = container.querySelector('[data-dimension]');
    expect(item).toHaveAttribute('data-disabled', '');
    expect(item).not.toHaveAttribute('disabled');
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled();

    rerender(
      <FormItem label="Name" htmlFor="disabled-field" disabled={false}>
        <Input id="disabled-field" disabled />
      </FormItem>,
    );

    expect(item).not.toHaveAttribute('data-disabled');
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeEnabled();
    unmount();
  });

  it('inherits size, status and required through an intermediate wrapper', () => {
    render(
      <FormItem dimension="xs" status="error" required>
        <div>
          <Input aria-label="Inherited" dimension="l" status="success" required={false} />
        </div>
      </FormItem>,
    );
    const input = screen.getByRole('textbox', { name: 'Inherited' });
    expect(input.parentElement).toHaveAttribute('data-dimension', 'xs');
    expect(input.parentElement).toHaveAttribute('data-status', 'error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeRequired();
  });

  it('prioritizes FormItem defaults over input settings while preserving an unspecified status', () => {
    const { rerender } = render(
      <FormItem dimension="xs" disabled required readOnly>
        <Input aria-label="Defaults" dimension="s" status="success" disabled required readOnly />
      </FormItem>,
    );
    const input = screen.getByRole('textbox', { name: 'Defaults' });
    expect(input.parentElement).toHaveAttribute('data-dimension', 'xs');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('readonly');

    rerender(
      <FormItem>
        <Input aria-label="Defaults" dimension="s" status="success" disabled required readOnly />
      </FormItem>,
    );
    expect(input.parentElement).toHaveAttribute('data-dimension', 'm');
    expect(input.parentElement).toHaveAttribute('data-status', 'success');
    expect(input).toBeEnabled();
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute('readonly');
  });

  it('prioritizes explicit false and updates inherited settings', () => {
    const { rerender } = render(
      <FormItem required={false} readOnly={false} disabled={false} status="success">
        <Input aria-label="Overrides" required readOnly disabled status="error" showClearIcon defaultValue="Text" />
      </FormItem>,
    );
    const input = screen.getByRole('textbox', { name: 'Overrides' });
    expect(input).toBeEnabled();
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute('readonly');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input.parentElement).toHaveAttribute('data-status', 'success');
    expect(screen.getByRole('button', { name: 'Очистить поле' })).toBeInTheDocument();

    rerender(
      <FormItem required readOnly status="error">
        <Input aria-label="Overrides" required={false} readOnly={false} showClearIcon defaultValue="Text" />
      </FormItem>,
    );
    expect(input).toBeEnabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
  });

  it('uses only the nearest FormItem settings', () => {
    render(
      <FormItem dimension="xs" status="error" disabled required readOnly>
        <FormItem>
          <Input aria-label="Nearest" />
        </FormItem>
      </FormItem>,
    );
    const input = screen.getByRole('textbox', { name: 'Nearest' });
    expect(input.parentElement).toHaveAttribute('data-dimension', 'm');
    expect(input.parentElement).not.toHaveAttribute('data-status');
    expect(input).toBeEnabled();
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute('readonly');
  });

  it('does not modify native fields through context', () => {
    render(
      <FormItem disabled required readOnly status="error">
        <input aria-label="Native" />
      </FormItem>,
    );
    const input = screen.getByRole('textbox', { name: 'Native' });
    expect(input).toBeEnabled();
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute('readonly');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('renders the error in the description and connects the label explicitly', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(
      <FormItem label="Email" htmlFor="email-field" status="error" description="Invalid address" required>
        <Input ref={inputRef} id="email-field" name="email" status="error" />
      </FormItem>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(inputRef.current).toBe(input);
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-field');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('id', 'email-field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid address')).toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(screen.getByText('Invalid address').closest('[data-status]')).toHaveAttribute('data-status', 'error');
  });

  it('shows a success message in the same description slot', () => {
    render(
      <FormItem label="Email" status="success" description="Address confirmed">
        <Input status="success" />
      </FormItem>,
    );

    expect(screen.getByText('Address confirmed').closest('[data-status]')).toHaveAttribute('data-status', 'success');
  });

  it('preserves the input id and existing description', () => {
    render(
      <>
        <span id="external-hint">External hint</span>
        <FormItem label="Name" htmlFor="name-field" description="Your name">
          <Input id="name-field" aria-describedby="external-hint" />
        </FormItem>
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('id', 'name-field');
    expect(input).toHaveAttribute('aria-describedby', 'external-hint');
    expect(screen.getByText('Your name').closest('[data-dimension]')).not.toHaveAttribute('data-status');
  });

  it('passes maxLength to Input and shows the counter at the configured threshold', () => {
    const { container } = render(
      <FormItem label="Name" htmlFor="counter-field" description="Short name" maxLength={20}>
        <Input id="counter-field" maxLength={30} defaultValue="123456789012345" />
      </FormItem>,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('maxlength', '20');
    expect(screen.queryByText('15 / 20')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '1234567890123456' } });

    const counter = screen.getByText('16 / 20');
    expect(input).not.toContainElement(counter);
    expect(counter.parentElement).toContainElement(screen.getByText('Short name'));
    expect(container.querySelector<HTMLLabelElement>('label')).not.toContainElement(input);
  });

  it('shows the counter from the start when counterThreshold is zero and marks the reached limit', () => {
    render(
      <FormItem maxLength={3} counterThreshold={0}>
        <Input aria-label="Code" defaultValue="123" />
      </FormItem>,
    );

    expect(screen.getByText('3 / 3')).toHaveAttribute('data-limit-reached', '');
  });

  it('updates the counter when Input is cleared', () => {
    render(
      <FormItem maxLength={5} counterThreshold={0}>
        <Input aria-label="Code" defaultValue="123" showClearIcon />
      </FormItem>,
    );

    expect(screen.getByText('3 / 5')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));
    expect(screen.getByText('0 / 5')).toBeInTheDocument();
  });

  it('synchronizes the counter when a controlled value changes externally', () => {
    const { rerender } = render(
      <FormItem maxLength={5} counterThreshold={0}>
        <Input aria-label="Code" value="12" readOnly />
      </FormItem>,
    );

    expect(screen.getByText('2 / 5')).toBeInTheDocument();

    rerender(
      <FormItem maxLength={5} counterThreshold={0}>
        <Input aria-label="Code" value="1234" readOnly />
      </FormItem>,
    );

    expect(screen.getByText('4 / 5')).toBeInTheDocument();
  });

  it('keeps the counter synchronized when a controlled Input rejects a change', async () => {
    render(
      <FormItem maxLength={5} counterThreshold={0}>
        <Input aria-label="Code" value="12" onChange={() => undefined} />
      </FormItem>,
    );

    const input = screen.getByRole('textbox', { name: 'Code' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '123' } });
    });

    expect(input).toHaveValue('12');
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });

  it('keeps the counter of a new Input when the previous Input is replaced', () => {
    const { rerender } = render(
      <FormItem maxLength={5} counterThreshold={0}>
        <Input key="first" aria-label="Code" defaultValue="12" />
      </FormItem>,
    );

    rerender(
      <FormItem maxLength={5} counterThreshold={0}>
        <Input key="second" aria-label="Code" defaultValue="1234" />
      </FormItem>,
    );

    expect(screen.getByText('4 / 5')).toBeInTheDocument();
  });

  it('synchronizes the counter after a native form reset', async () => {
    render(
      <form>
        <FormItem maxLength={5} counterThreshold={0}>
          <Input aria-label="Code" defaultValue="12" />
        </FormItem>
        <button type="reset">Reset</button>
      </form>,
    );

    const input = screen.getByRole('textbox', { name: 'Code' });
    fireEvent.change(input, { target: { value: '1234' } });
    expect(screen.getByText('4 / 5')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => expect(screen.getByText('2 / 5')).toBeInTheDocument());
  });

  it('skips empty optional slots and preserves zero', () => {
    const { container, rerender } = render(
      <FormItem label="Name" additionalLabel={true} description={true}>
        <input />
      </FormItem>,
    );

    expect(container.querySelectorAll('span')).toHaveLength(0);

    rerender(
      <FormItem label="Name" additionalLabel={0} description={0}>
        <input />
      </FormItem>,
    );

    expect(Array.from(container.querySelectorAll('span'), (span) => span.textContent)).toEqual(['0', '0']);
  });

  it('places the additional label beside the field label without changing its accessible name', () => {
    const { container } = render(
      <FormItem label="Name" additionalLabel="Optional" htmlFor="additional-label-field">
        <Input id="additional-label-field" />
      </FormItem>,
    );

    const input = container.querySelector<HTMLInputElement>('#additional-label-field');
    const label = container.querySelector<HTMLLabelElement>('label');
    const additionalLabel = container.querySelector<HTMLSpanElement>('label + span');
    expect(label).not.toBeNull();
    expect(additionalLabel).not.toBeNull();
    if (!label || !additionalLabel) return;
    expect(label).toHaveAttribute('for', 'additional-label-field');
    expect(label.parentElement).toContainElement(additionalLabel);
    expect(label).not.toContainElement(additionalLabel);
    expect(input).toHaveAccessibleName('Name');
  });

  it('applies CSS mixins to the label, additional label and description', () => {
    const compactText = css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;

    render(
      <FormItem
        label="Name"
        additionalLabel="Optional"
        description="Description"
        labelCssMixins={{
          label: css`
            flex: 0 0 70%;
          `,
          additionalLabel: css`
            flex: 0 0 calc(30% - 8px);
            max-width: none;
          `,
          description: compactText,
        }}
      >
        <Input />
      </FormItem>,
    );

    expect(screen.getByText('Name')).toHaveStyle({ flex: '0 0 70%' });
    expect(screen.getByText('Optional')).toHaveStyle({ flex: '0 0 calc(30% - 8px)', maxWidth: 'none' });
    expect(screen.getByText('Description')).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
  });

  it('shows native titles only for enabled overflowing string labels', () => {
    render(
      <FormItem
        label="Name"
        additionalLabel="Optional"
        description="Description"
        visibleLabelTooltips={{ label: true, additionalLabel: true, description: true }}
      >
        <Input />
      </FormItem>,
    );

    const label = screen.getByText('Name');
    const additionalLabel = screen.getByText('Optional');
    const description = screen.getByText('Description');

    for (const element of [label, additionalLabel, description]) {
      Object.defineProperties(element, {
        clientWidth: { configurable: true, value: 100 },
        scrollWidth: { configurable: true, value: 200 },
      });
      fireEvent.mouseEnter(element);
      expect(element).toHaveAttribute('title', element.textContent ?? '');
      fireEvent.mouseLeave(element);
      expect(element).not.toHaveAttribute('title');
    }
  });

  it('does not show native titles when tooltips are disabled or text fits', () => {
    const { rerender } = render(
      <FormItem label="Name">
        <Input />
      </FormItem>,
    );
    const label = screen.getByText('Name');

    Object.defineProperties(label, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    });
    fireEvent.mouseEnter(label);
    expect(label).not.toHaveAttribute('title');

    rerender(
      <FormItem label="Name" visibleLabelTooltips={{ label: true }}>
        <Input />
      </FormItem>,
    );
    const fittingLabel = screen.getByText('Name');
    Object.defineProperties(fittingLabel, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 100 },
    });
    fireEvent.mouseEnter(fittingLabel);
    expect(fittingLabel).not.toHaveAttribute('title');
  });

  it('uses m by default and accepts xs for a matching input', () => {
    const { container, rerender } = render(
      <FormItem label="Name">
        <Input dimension="m" />
      </FormItem>,
    );
    expect(container.querySelector('label')?.parentElement?.parentElement).toHaveAttribute('data-dimension', 'm');

    rerender(
      <FormItem label="Name" dimension="xs">
        <Input dimension="xs" />
      </FormItem>,
    );
    expect(container.querySelector('label')?.parentElement?.parentElement).toHaveAttribute('data-dimension', 'xs');
  });
});
