import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Hint } from './Hint';
import { HINT_DIMENSIONS, HINT_DIMENSION_PARAMETERS } from './constants';

describe('Hint', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Hint data-testid="hint">Content</Hint>);

    const component = screen.getByTestId('hint');

    expect(component).toHaveTextContent('Content');
  });

  it('forwards div attributes to the root element', () => {
    render(<Hint data-testid="hint" title="Hint" />);

    const component = screen.getByTestId('hint');

    expect(component).toHaveAttribute('data-testid', 'hint');
    expect(component).toHaveAttribute('title', 'Hint');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Hint ref={ref} data-testid="hint" />);

    expect(ref.current).toBe(screen.getByTestId('hint'));
  });

  it.each(HINT_DIMENSIONS)('applies the %s dimension without forwarding it to the DOM', (dimension) => {
    render(<Hint data-testid="hint" dimension={dimension} />);

    const component = screen.getByTestId('hint');

    expect(component).toHaveStyle({
      minHeight: `${HINT_DIMENSION_PARAMETERS[dimension].minHeight}px`,
    });
    expect(component).not.toHaveAttribute('dimension');
  });
});
