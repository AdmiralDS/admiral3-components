import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { InputIcon } from './style';

describe('InputIcon', () => {
  afterEach(cleanup);

  it('applies its own disabled state without forwarding an invalid span attribute', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<InputIcon ref={ref} data-testid="icon" disabled />);

    const icon = screen.getByTestId('icon');

    expect(ref.current).toBe(icon);
    expect(icon).toHaveAttribute('data-disabled');
    expect(icon).not.toHaveAttribute('disabled');
    expect(icon).toHaveStyle({ cursor: 'not-allowed' });
  });
});
