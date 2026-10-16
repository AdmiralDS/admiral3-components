import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Avatar } from './Avatar';
import { AVATAR_DIMENSIONS, AVATAR_DIMENSION_PARAMETERS } from './constants';

describe('Avatar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Avatar data-testid="avatar">Content</Avatar>);

    const component = screen.getByTestId('avatar');

    expect(component).toHaveTextContent('Content');
  });

  it('forwards div attributes to the root element', () => {
    render(<Avatar data-testid="avatar" title="Avatar" />);

    const component = screen.getByTestId('avatar');

    expect(component).toHaveAttribute('data-testid', 'avatar');
    expect(component).toHaveAttribute('title', 'Avatar');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Avatar ref={ref} data-testid="avatar" />);

    expect(ref.current).toBe(screen.getByTestId('avatar'));
  });

  it.each(AVATAR_DIMENSIONS)('applies the %s dimension without forwarding it to the DOM', (dimension) => {
    render(<Avatar data-testid="avatar" dimension={dimension} />);

    const component = screen.getByTestId('avatar');

    expect(component).toHaveStyle({
      minHeight: `${AVATAR_DIMENSION_PARAMETERS[dimension].minHeight}px`,
    });
    expect(component).not.toHaveAttribute('dimension');
  });
});
