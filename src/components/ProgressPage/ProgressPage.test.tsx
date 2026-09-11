import { createRef } from 'react';

import { textStyles, themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, render, screen } from '@testing-library/react';
import type { ExecutionContext } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { PROGRESS_PAGE_VALUE_PROPERTY } from './constants';
import { ProgressPage } from './ProgressPage';
import { textColor } from './style';

const getProgressbar = () => screen.getByRole('progressbar');

const getIndicator = () => {
  const indicator = getProgressbar().firstElementChild;

  expect(indicator).toBeInstanceOf(HTMLDivElement);

  return indicator as HTMLDivElement;
};

const resolveToken = (token: (context: ExecutionContext) => string, theme = themes.light) => {
  return token({ theme } as ExecutionContext);
};

describe('ProgressPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('forwards div attributes and ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<ProgressPage ref={ref} data-testid="progress-page" title="ProgressPage" />);

    const component = screen.getByTestId('progress-page');

    expect(component).toHaveAttribute('title', 'ProgressPage');
    expect(ref.current).toBe(component);
  });

  it('renders controlled determinate progress and updates the indicator value', () => {
    const { rerender } = render(<ProgressPage value={35} aria-label="Loading" />);

    const progressbar = getProgressbar();

    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuenow', '35');
    expect(getIndicator().style.getPropertyValue(PROGRESS_PAGE_VALUE_PROPERTY)).toBe('35%');

    rerender(<ProgressPage value={70} aria-label="Loading" />);

    expect(progressbar).toHaveAttribute('aria-valuenow', '70');
    expect(getIndicator().style.getPropertyValue(PROGRESS_PAGE_VALUE_PROPERTY)).toBe('70%');
  });

  it.each([
    ['a negative value', -10, '0'],
    ['a value greater than 100', 110, '100'],
    ['NaN', Number.NaN, '0'],
  ])('normalizes %s', (_, value, expectedValue) => {
    render(<ProgressPage value={value} aria-label="Loading" />);

    expect(getProgressbar()).toHaveAttribute('aria-valuenow', expectedValue);
    expect(getIndicator().style.getPropertyValue(PROGRESS_PAGE_VALUE_PROPERTY)).toBe(`${expectedValue}%`);
  });

  it('renders indeterminate progress when value is not specified', () => {
    render(<ProgressPage aria-label="Loading" />);

    expect(getProgressbar()).not.toHaveAttribute('aria-valuenow');
    expect(getIndicator().style.getPropertyValue(PROGRESS_PAGE_VALUE_PROPERTY)).toBe('0%');
  });

  it('uses the visible label as the accessible name', () => {
    render(<ProgressPage value={35} label="Loading files" />);

    const label = screen.getByText('Loading files');

    expect(getProgressbar()).toHaveAttribute('aria-labelledby', label.id);
    expect(label.id).not.toBe('');
  });

  it('applies body2Short typography and theme color to labels', () => {
    render(
      <ThemeProvider theme={themes.dark}>
        <ProgressPage value={35} label="Loading files" valueLabel="35%" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Loading files').parentElement).toHaveStyle({
      ...textStyles.body.body2Short,
      color: resolveToken(textColor, themes.dark),
    });
  });

  it('prefers an explicitly provided accessible name over the visible label', () => {
    render(<ProgressPage value={35} label="Loading files" aria-label="File upload progress" />);

    expect(getProgressbar()).toHaveAttribute('aria-label', 'File upload progress');
    expect(getProgressbar()).not.toHaveAttribute('aria-labelledby');
  });

  it('forwards explicitly provided progressbar aria attributes', () => {
    render(
      <ProgressPage
        value={35}
        aria-labelledby="external-label"
        aria-describedby="progress-description"
        aria-valuetext="35 of 100 files uploaded"
      />,
    );

    expect(getProgressbar()).toHaveAttribute('aria-labelledby', 'external-label');
    expect(getProgressbar()).toHaveAttribute('aria-describedby', 'progress-description');
    expect(getProgressbar()).toHaveAttribute('aria-valuetext', '35 of 100 files uploaded');
  });

  it('uses the primary appearance by default', () => {
    render(<ProgressPage data-testid="progress-page" aria-label="Loading" />);

    expect(screen.getByTestId('progress-page')).toHaveAttribute('data-appearance', 'primary');
  });

  it.each([
    ['track', false, { backgroundColor: 'var(--custom-track)' }, 'track', 'var(--custom-track)'],
    ['regular', false, { progressColor: 'var(--custom-progress)' }, 'indicator', 'var(--custom-progress)'],
    ['error', true, { progressColorError: 'var(--custom-error)' }, 'indicator', 'var(--custom-error)'],
  ] as const)('uses a partial custom color config for the %s', (_, error, appearance, target, expectedColor) => {
    render(
      <ProgressPage
        data-testid="progress-page"
        value={35}
        error={error}
        aria-label="Loading"
        appearance={appearance}
      />,
    );

    expect(screen.getByTestId('progress-page')).toHaveAttribute('data-appearance', 'custom');
    expect(target === 'track' ? getProgressbar() : getIndicator()).toHaveStyle({ backgroundColor: expectedColor });
  });
});
