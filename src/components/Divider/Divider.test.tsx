import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DIVIDER_ROOT_DATA_ATTRIBUTE } from './constants';
import { Divider } from './Divider';

describe('Divider', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Divider data-testid="divider">Content</Divider>);

    expect(screen.getByTestId('divider')).toHaveTextContent('Content');
  });

  it('forwards div attributes to the root element', () => {
    render(<Divider data-testid="divider" title="Divider" />);

    expect(screen.getByTestId('divider')).toHaveAttribute('title', 'Divider');
    expect(screen.getByTestId('divider')).toHaveAttribute(DIVIDER_ROOT_DATA_ATTRIBUTE, 'true');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Divider ref={ref} data-testid="divider" />);

    expect(ref.current).toBe(screen.getByTestId('divider'));
  });

  it('uses default appearance, dimension, orientation and length', () => {
    render(<Divider data-testid="divider" />);

    const divider = screen.getByTestId('divider');

    expect(divider).toHaveAttribute('data-appearance', 'default');
    expect(divider).toHaveAttribute('data-dimension', 'm');
    expect(divider).toHaveAttribute('data-orientation', 'horizontal');
    expect(divider).toHaveStyle({ width: '100%', height: '2px' });
  });

  it('applies horizontal dimension and numeric length', () => {
    render(<Divider data-testid="divider" dimension="s" length={160} />);

    expect(screen.getByTestId('divider')).toHaveStyle({ width: '160px', height: '1px' });
  });

  it('applies vertical orientation and string length', () => {
    render(<Divider data-testid="divider" length="4rem" orientation="vertical" />);

    expect(screen.getByTestId('divider')).toHaveStyle({ width: '2px', height: '4rem' });
  });

  it('uses a custom appearance as background color', () => {
    render(<Divider appearance="var(--custom-divider-color)" data-testid="divider" />);

    expect(screen.getByTestId('divider')).toHaveStyle({ backgroundColor: 'var(--custom-divider-color)' });
  });
});
