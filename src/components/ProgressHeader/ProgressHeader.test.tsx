import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PROGRESS_HEADER_VALUE_PROPERTY } from './constants';
import { ProgressHeader } from './ProgressHeader';

const getProgressbar = () => screen.getByRole('progressbar');

const getIndicator = () => {
  const indicator = getProgressbar().firstElementChild;

  expect(indicator).toBeInstanceOf(HTMLDivElement);

  return indicator as HTMLDivElement;
};

describe('ProgressHeader', () => {
  afterEach(() => {
    cleanup();
  });

  it('forwards div attributes to the root element', () => {
    render(<ProgressHeader data-testid="progress-header" title="ProgressHeader" />);

    const component = screen.getByTestId('progress-header');

    expect(component).toHaveAttribute('data-testid', 'progress-header');
    expect(component).toHaveAttribute('title', 'ProgressHeader');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<ProgressHeader ref={ref} data-testid="progress-header" />);

    expect(ref.current).toBe(screen.getByTestId('progress-header'));
  });

  it('renders controlled determinate progress and updates the indicator value', () => {
    const { rerender } = render(<ProgressHeader data-testid="progress-header" value={35} aria-label="Loading" />);

    const component = screen.getByTestId('progress-header');

    expect(component).toHaveAttribute('role', 'progressbar');
    expect(component).toHaveAttribute('aria-valuemin', '0');
    expect(component).toHaveAttribute('aria-valuemax', '100');
    expect(component).toHaveAttribute('aria-valuenow', '35');
    expect(component.style.getPropertyValue(PROGRESS_HEADER_VALUE_PROPERTY)).toBe('0.35');

    rerender(<ProgressHeader data-testid="progress-header" value={70} aria-label="Loading" />);

    expect(component).toHaveAttribute('aria-valuenow', '70');
    expect(component.style.getPropertyValue(PROGRESS_HEADER_VALUE_PROPERTY)).toBe('0.7');
  });

  it.each([
    ['a negative value', -10, '0', '0'],
    ['a value greater than 100', 110, '100', '1'],
    ['NaN', Number.NaN, '0', '0'],
  ])('normalizes %s', (_, value, expectedValue, expectedScale) => {
    render(<ProgressHeader value={value} aria-label="Loading" />);

    expect(getProgressbar()).toHaveAttribute('aria-valuenow', expectedValue);
    expect(getProgressbar().style.getPropertyValue(PROGRESS_HEADER_VALUE_PROPERTY)).toBe(expectedScale);
  });

  it('renders indeterminate progress when value is not specified', () => {
    render(<ProgressHeader aria-label="Loading" />);

    expect(getProgressbar()).not.toHaveAttribute('aria-valuenow');
    expect(getProgressbar().style.getPropertyValue(PROGRESS_HEADER_VALUE_PROPERTY)).toBe('0');
  });

  it('forwards explicitly provided progressbar aria attributes', () => {
    render(
      <ProgressHeader
        value={35}
        aria-label="Loading"
        aria-labelledby="external-label"
        aria-describedby="progress-description"
        aria-valuetext="35 of 100 files uploaded"
      />,
    );

    expect(getProgressbar()).toHaveAttribute('aria-label', 'Loading');
    expect(getProgressbar()).toHaveAttribute('aria-labelledby', 'external-label');
    expect(getProgressbar()).toHaveAttribute('aria-describedby', 'progress-description');
    expect(getProgressbar()).toHaveAttribute('aria-valuetext', '35 of 100 files uploaded');
  });

  it('preserves a custom root style while setting the progress value', () => {
    render(<ProgressHeader value={35} style={{ top: 8 }} aria-label="Loading" />);

    expect(getProgressbar()).toHaveStyle({ top: '8px' });
    expect(getProgressbar().style.getPropertyValue(PROGRESS_HEADER_VALUE_PROPERTY)).toBe('0.35');
  });

  it('uses the primary appearance by default', () => {
    render(<ProgressHeader data-testid="progress-header" aria-label="Loading" />);

    expect(screen.getByTestId('progress-header')).toHaveAttribute('data-appearance', 'primary');
  });

  it.each([
    ['track', false, { backgroundColor: 'var(--custom-track)' }, 'track', 'var(--custom-track)'],
    ['regular', false, { progressColor: 'var(--custom-progress)' }, 'indicator', 'var(--custom-progress)'],
    ['error', true, { progressColorError: 'var(--custom-error)' }, 'indicator', 'var(--custom-error)'],
  ] as const)('uses a partial custom color config for the %s', (_, error, appearance, target, expectedColor) => {
    render(
      <ProgressHeader
        data-testid="progress-header"
        value={35}
        error={error}
        aria-label="Loading"
        appearance={appearance}
      />,
    );

    expect(screen.getByTestId('progress-header')).toHaveAttribute('data-appearance', 'custom');
    expect(target === 'track' ? getProgressbar() : getIndicator()).toHaveStyle({ backgroundColor: expectedColor });
  });
});
