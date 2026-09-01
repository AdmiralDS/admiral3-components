import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FIELDSET_DIMENSIONS, FIELDSET_DIMENSION_PARAMETERS, FIELDSET_ORIENTATIONS } from './constants';
import { FieldSet } from './FieldSet';

describe('FieldSet', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<FieldSet data-testid="field-set">Content</FieldSet>);

    expect(screen.getByTestId('field-set')).toHaveTextContent('Content');
  });

  it('renders a semantic fieldset with an accessible legend', () => {
    render(
      <FieldSet legend="Personal data">
        <input aria-label="Name" />
      </FieldSet>,
    );

    const fieldset = screen.getByRole('group', { name: 'Personal data' });

    expect(fieldset.tagName).toBe('FIELDSET');
    expect(fieldset.querySelector('legend')).toHaveTextContent('Personal data');
  });

  it('does not render an empty legend', () => {
    const { container } = render(<FieldSet />);

    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  it('uses default dimension and orientation', () => {
    render(<FieldSet data-testid="field-set" />);

    expect(screen.getByTestId('field-set')).toHaveAttribute('data-dimension', 'm');
    expect(screen.getByTestId('field-set')).toHaveAttribute('data-orientation', 'vertical');
  });

  it.each(FIELDSET_DIMENSIONS)('applies %s dimension typography and vertical spacing', (dimension) => {
    render(
      <FieldSet data-testid="field-set" dimension={dimension} legend="Legend">
        Content
      </FieldSet>,
    );

    const parameters = FIELDSET_DIMENSION_PARAMETERS[dimension];

    expect(screen.getByTestId('field-set')).toHaveStyle({ gap: `${parameters.gap.vertical}px` });
    expect(screen.getByText('Legend')).toHaveStyle({
      ...parameters.typography,
      marginBottom: `${parameters.gap.vertical}px`,
    });
  });

  it.each(FIELDSET_ORIENTATIONS)('applies %s orientation and its default gap', (orientation) => {
    render(<FieldSet data-testid="field-set" orientation={orientation} />);

    expect(screen.getByTestId('field-set')).toHaveStyle({
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
      gap: `${FIELDSET_DIMENSION_PARAMETERS.m.gap[orientation]}px`,
    });
  });

  it.each([
    [0, '0px'],
    [8, '8px'],
    ['1.5rem', '1.5rem'],
  ] as const)('applies custom gap %s', (gap, expectedGap) => {
    render(<FieldSet data-testid="field-set" gap={gap} />);

    expect(screen.getByTestId('field-set')).toHaveStyle({ gap: expectedGap });
  });

  it('reflects dimension, orientation and required state', () => {
    render(<FieldSet data-testid="field-set" dimension="xs" orientation="horizontal" required />);

    expect(screen.getByTestId('field-set')).toHaveAttribute('data-dimension', 'xs');
    expect(screen.getByTestId('field-set')).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getByTestId('field-set')).toHaveAttribute('data-required', '');
  });

  it('maps error state to aria-invalid', () => {
    const { rerender } = render(<FieldSet data-testid="field-set" error />);

    expect(screen.getByTestId('field-set')).toHaveAttribute('aria-invalid', 'true');

    rerender(<FieldSet data-testid="field-set" error={false} />);

    expect(screen.getByTestId('field-set')).not.toHaveAttribute('aria-invalid');
  });

  it('preserves an explicitly provided aria-invalid state', () => {
    render(<FieldSet data-testid="field-set" aria-invalid="grammar" />);

    expect(screen.getByTestId('field-set')).toHaveAttribute('aria-invalid', 'grammar');
  });

  it('forwards fieldset attributes to the root element', () => {
    render(<FieldSet data-testid="field-set" title="FieldSet" disabled name="profile" />);

    expect(screen.getByTestId('field-set')).toHaveAttribute('title', 'FieldSet');
    expect(screen.getByTestId('field-set')).toBeDisabled();
    expect(screen.getByTestId('field-set')).toHaveAttribute('name', 'profile');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLFieldSetElement>();

    render(<FieldSet ref={ref} data-testid="field-set" />);

    expect(ref.current).toBe(screen.getByTestId('field-set'));
  });
});
