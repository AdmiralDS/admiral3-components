import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Tag } from './Tag';
import { TAG_DIMENSIONS, TAG_DIMENSION_PARAMETERS } from './constants';

describe('Tag', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Tag data-testid="tag">Content</Tag>);

    const component = screen.getByTestId('tag');

    expect(component).toHaveTextContent('Content');
  });

  it('forwards div attributes to the root element', () => {
    render(<Tag data-testid="tag" title="Tag" />);

    const component = screen.getByTestId('tag');

    expect(component).toHaveAttribute('data-testid', 'tag');
    expect(component).toHaveAttribute('title', 'Tag');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Tag ref={ref} data-testid="tag" />);

    expect(ref.current).toBe(screen.getByTestId('tag'));
  });

  it.each(TAG_DIMENSIONS)('applies the %s dimension without forwarding it to the DOM', (dimension) => {
    render(<Tag data-testid="tag" dimension={dimension} />);

    const component = screen.getByTestId('tag');

    expect(component).toHaveStyle({
      minHeight: `${TAG_DIMENSION_PARAMETERS[dimension].minHeight}px`,
    });
    expect(component).not.toHaveAttribute('dimension');
  });
});
