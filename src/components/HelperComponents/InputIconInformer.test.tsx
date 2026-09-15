import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { InputIconInformer } from './InputIconInformer';

describe('InputIconInformer', () => {
  afterEach(cleanup);

  it('renders an informer button without moving focus to the input', () => {
    render(<InputIconInformer data-testid="informer" title="Hint text" tabIndex={0} />);

    const informer = screen.getByTestId('informer');

    expect(informer.tagName).toBe('BUTTON');
    expect(informer).toHaveAttribute('type', 'button');
    expect(informer).toHaveAttribute('data-prevent-input-focus');
    expect(informer).toHaveAttribute('title', 'Hint text');
    expect(informer).toHaveAttribute('tabindex', '0');
    expect(informer.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
