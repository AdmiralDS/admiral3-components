import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Tooltip } from './Tooltip';
import { TOOLTIP_DIMENSIONS, TOOLTIP_DIMENSION_PARAMETERS } from './constants';

describe('Tooltip', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Tooltip data-testid="tooltip">Content</Tooltip>);

    const component = screen.getByTestId('tooltip');

    expect(component).toHaveTextContent('Content');
  });

  it('forwards div attributes to the root element', () => {
    render(<Tooltip data-testid="tooltip" title="Tooltip" />);

    const component = screen.getByTestId('tooltip');

    expect(component).toHaveAttribute('data-testid', 'tooltip');
    expect(component).toHaveAttribute('title', 'Tooltip');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Tooltip ref={ref} data-testid="tooltip" />);

    expect(ref.current).toBe(screen.getByTestId('tooltip'));
  });

  it.each(TOOLTIP_DIMENSIONS)('applies the %s dimension without forwarding it to the DOM', (dimension) => {
    render(<Tooltip data-testid="tooltip" dimension={dimension} />);

    const component = screen.getByTestId('tooltip');

    expect(component).toHaveStyle({
      minHeight: `${TOOLTIP_DIMENSION_PARAMETERS[dimension].minHeight}px`,
    });
    expect(component).not.toHaveAttribute('dimension');
  });
});
