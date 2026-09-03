import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ProgressHeader } from './ProgressHeader';

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

  it('adds progressbar semantics to a determinate value', () => {
    render(<ProgressHeader data-testid="progress-header" value={35} aria-label="Loading" />);

    const component = screen.getByTestId('progress-header');

    expect(component).toHaveAttribute('role', 'progressbar');
    expect(component).toHaveAttribute('aria-valuemin', '0');
    expect(component).toHaveAttribute('aria-valuemax', '100');
    expect(component).toHaveAttribute('aria-valuenow', '35');
  });
});
