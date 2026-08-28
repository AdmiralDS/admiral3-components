import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RADIO_BUTTON_DIMENSIONS, RADIO_BUTTON_DIMENSION_PARAMETERS } from './constants';
import { RadioButton } from './RadioButton';
import { RadioGroup } from './RadioGroup';

describe('RadioButton components', () => {
  afterEach(cleanup);

  describe('RadioButton', () => {
    it('renders a native radio with label and extra text', () => {
      render(
        <RadioButton name="answer" value="yes" extraText="Additional information">
          Yes
        </RadioButton>,
      );
      const input = screen.getByRole('radio', { name: /yes/i });
      expect(input).toHaveAttribute('name', 'answer');
      expect(input).toHaveAttribute('value', 'yes');
      expect(input.closest('label')).not.toBeNull();
      expect(screen.getByText('Additional information')).toBeInTheDocument();
    });

    it('forwards ref to the native input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<RadioButton ref={ref}>Radio</RadioButton>);
      expect(ref.current).toBe(screen.getByRole('radio'));
    });

    it('passes className to the root label', () => {
      render(<RadioButton className="custom-radio">Radio</RadioButton>);
      expect(screen.getByRole('radio').closest('label')).toHaveClass('custom-radio');
    });

    it.each(RADIO_BUTTON_DIMENSIONS)('sets %s dimension data-attribute', (dimension) => {
      render(<RadioButton dimension={dimension}>Radio</RadioButton>);
      const label = screen.getByRole('radio').closest('label');
      const typography = RADIO_BUTTON_DIMENSION_PARAMETERS[dimension].typography;

      expect(label).toHaveAttribute('data-dimension', dimension);
      expect(label).toHaveStyle({
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      });
    });

    it('supports checked and disabled native states', () => {
      render(
        <RadioButton checked disabled onChange={() => undefined}>
          Radio
        </RadioButton>,
      );
      expect(screen.getByRole('radio')).toBeChecked();
      expect(screen.getByRole('radio')).toBeDisabled();
    });

    it('marks the native radio as invalid in the error state', () => {
      render(<RadioButton error>Radio</RadioButton>);
      expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
    });

    it('emits click and change when activated', () => {
      const onChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) => event.currentTarget.checked);
      const onClick = vi.fn();
      render(
        <RadioButton onChange={onChange} onClick={onClick}>
          Radio
        </RadioButton>,
      );
      const radio = screen.getByRole('radio');
      fireEvent.click(radio);
      expect(radio).toBeChecked();
      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick.mock.calls[0][0]).toHaveProperty('defaultPrevented', false);
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange.mock.results[0].value).toBe(true);
    });

    it('inherits native disabled state from fieldset', () => {
      render(
        <fieldset disabled>
          <RadioButton>Radio</RadioButton>
        </fieldset>,
      );
      expect(screen.getByRole('radio')).toBeDisabled();
    });
  });

  describe('RadioGroup', () => {
    it('renders a FieldSet and passes common props to radio buttons', () => {
      render(
        <RadioGroup name="delivery" legend="Delivery" dimension="s" required error>
          <RadioButton value="courier">Courier</RadioButton>
          <RadioButton value="pickup">Pickup</RadioButton>
        </RadioGroup>,
      );
      expect(screen.getByRole('group', { name: 'Delivery' })).toHaveAttribute('data-dimension', 's');
      screen.getAllByRole('radio').forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'delivery');
        expect(radio).toBeRequired();
      });
      expect(screen.getByRole('group', { name: 'Delivery' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('generates a stable unique name when name is omitted', () => {
      const { rerender } = render(
        <>
          <RadioGroup>
            <RadioButton value="first">First</RadioButton>
            <RadioButton value="second">Second</RadioButton>
          </RadioGroup>
          <RadioGroup>
            <RadioButton value="third">Third</RadioButton>
          </RadioGroup>
        </>,
      );
      const firstName = screen.getByRole('radio', { name: 'First' }).getAttribute('name');
      const secondName = screen.getByRole('radio', { name: 'Second' }).getAttribute('name');
      const thirdName = screen.getByRole('radio', { name: 'Third' }).getAttribute('name');
      expect(firstName).toMatch(/^radio-group-/);
      expect(secondName).toBe(firstName);
      expect(thirdName).not.toBe(firstName);

      rerender(
        <>
          <RadioGroup>
            <RadioButton value="first">First</RadioButton>
            <RadioButton value="second">Second</RadioButton>
          </RadioGroup>
          <RadioGroup>
            <RadioButton value="third">Third</RadioButton>
          </RadioGroup>
        </>,
      );
      expect(screen.getByRole('radio', { name: 'First' }).getAttribute('name')).toBe(firstName);
    });

    it('supports uncontrolled value', () => {
      const onChange = vi.fn();
      render(
        <RadioGroup name="answer" defaultValue="yes" onChange={onChange}>
          <RadioButton value="yes">Yes</RadioButton>
          <RadioButton value="no">No</RadioButton>
        </RadioGroup>,
      );
      expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked();
      fireEvent.click(screen.getByRole('radio', { name: 'No' }));
      expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();
      expect(onChange).toHaveBeenCalledWith('no');
    });

    it('supports controlled value', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <RadioGroup name="answer" value="yes" onChange={onChange}>
          <RadioButton value="yes">Yes</RadioButton>
          <RadioButton value="no">No</RadioButton>
        </RadioGroup>,
      );
      fireEvent.click(screen.getByRole('radio', { name: 'No' }));
      expect(onChange).toHaveBeenCalledWith('no');
      expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked();

      rerender(
        <RadioGroup name="answer" value="no" onChange={onChange}>
          <RadioButton value="yes">Yes</RadioButton>
          <RadioButton value="no">No</RadioButton>
        </RadioGroup>,
      );
      expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();
    });

    it('gives group state and props priority over radio button props', () => {
      render(
        <RadioGroup name="group-name" defaultValue="yes" dimension="s" required>
          <RadioButton name="radio-name" value="yes" checked={false} dimension="xs" required={false}>
            Yes
          </RadioButton>
          <RadioButton value="no" defaultChecked>
            No
          </RadioButton>
        </RadioGroup>,
      );

      const yes = screen.getByRole('radio', { name: 'Yes' });
      const no = screen.getByRole('radio', { name: 'No' });

      expect(yes).toBeChecked();
      expect(no).not.toBeChecked();
      expect(yes).toHaveAttribute('name', 'group-name');
      expect(yes.closest('label')).toHaveAttribute('data-dimension', 's');
      expect(yes).toBeRequired();
      expect(no).toBeRequired();
    });

    it('calls both radio button and group change handlers', () => {
      const onRadioChange = vi.fn();
      const onGroupChange = vi.fn();
      render(
        <RadioGroup name="answer" onChange={onGroupChange}>
          <RadioButton value="yes" onChange={onRadioChange}>
            Yes
          </RadioButton>
        </RadioGroup>,
      );

      fireEvent.click(screen.getByRole('radio', { name: 'Yes' }));

      expect(onRadioChange).toHaveBeenCalledOnce();
      expect(onGroupChange).toHaveBeenCalledOnce();
      expect(onGroupChange).toHaveBeenCalledWith('yes');
    });

    it('restores the initial uncontrolled value when the form is reset', () => {
      render(
        <form aria-label="Form">
          <RadioGroup name="answer" defaultValue="yes">
            <RadioButton value="yes">Yes</RadioButton>
            <RadioButton value="no">No</RadioButton>
          </RadioGroup>
        </form>,
      );

      fireEvent.click(screen.getByRole('radio', { name: 'No' }));
      expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();

      fireEvent.reset(screen.getByRole('form', { name: 'Form' }));

      expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked();
    });

    it('does not change a controlled value when the form is reset', () => {
      render(
        <form aria-label="Form">
          <RadioGroup name="answer" value="no">
            <RadioButton value="yes">Yes</RadioButton>
            <RadioButton value="no">No</RadioButton>
          </RadioGroup>
        </form>,
      );

      fireEvent.reset(screen.getByRole('form', { name: 'Form' }));

      expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();
    });

    it('applies group readOnly state without disabling focus', () => {
      const onChange = vi.fn();
      render(
        <RadioGroup name="answer" defaultValue="yes" readOnly onChange={onChange}>
          <RadioButton value="yes">Yes</RadioButton>
          <RadioButton value="no">No</RadioButton>
        </RadioGroup>,
      );
      const radio = screen.getByRole('radio', { name: 'No' });
      fireEvent.click(radio);
      expect(radio).not.toBeChecked();
      expect(radio).not.toBeDisabled();
      expect(radio).toHaveAttribute('aria-readonly', 'true');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('disables all radio buttons', () => {
      render(
        <RadioGroup name="answer" disabled>
          <RadioButton value="yes">Yes</RadioButton>
          <RadioButton value="no">No</RadioButton>
        </RadioGroup>,
      );
      screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
    });

    it('forwards ref to FieldSet', () => {
      const ref = createRef<HTMLFieldSetElement>();
      render(
        <RadioGroup ref={ref} name="answer" legend="Answer">
          <RadioButton value="yes">Yes</RadioButton>
        </RadioGroup>,
      );
      expect(ref.current).toBe(screen.getByRole('group', { name: 'Answer' }));
    });
  });
});
