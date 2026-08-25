import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { TemplateName } from './TemplateName';
import { TEMPLATE_NAME_DIMENSIONS, TEMPLATE_NAME_DIMENSION_PARAMETERS } from './constants';

describe('TemplateName', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<TemplateName data-testid="template-name">Content</TemplateName>);

    const component = screen.getByTestId('template-name');

    expect(component).toHaveTextContent('Content');
  });

  it('forwards div attributes to the root element', () => {
    render(<TemplateName data-testid="template-name" title="TemplateName" />);

    const component = screen.getByTestId('template-name');

    expect(component).toHaveAttribute('data-testid', 'template-name');
    expect(component).toHaveAttribute('title', 'TemplateName');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<TemplateName ref={ref} data-testid="template-name" />);

    expect(ref.current).toBe(screen.getByTestId('template-name'));
  });

  it.each(TEMPLATE_NAME_DIMENSIONS)('applies the %s dimension without forwarding it to the DOM', (dimension) => {
    render(<TemplateName data-testid="template-name" dimension={dimension} />);

    const component = screen.getByTestId('template-name');

    expect(component).toHaveStyle({
      minHeight: `${TEMPLATE_NAME_DIMENSION_PARAMETERS[dimension].minHeight}px`,
    });
    expect(component).not.toHaveAttribute('dimension');
  });
});
