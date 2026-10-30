import { createRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { InputIconInformer } from './InputIconInformer';

describe('InputIconInformer', () => {
  afterEach(cleanup);

  it('renders an informer button without moving focus to the input and forwards its ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <InputIconInformer ref={ref} data-testid="informer" aria-label="Field help" renderContent={() => 'Hint text'} />,
    );

    const informer = screen.getByTestId('informer');

    expect(informer.tagName).toBe('BUTTON');
    expect(informer).toHaveAttribute('type', 'button');
    expect(informer).toHaveAttribute('data-prevent-input-focus');
    expect(informer).toHaveAccessibleName('Field help');
    expect(informer.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(ref.current).toBe(informer);
  });

  it('opens Hint on click by default', () => {
    render(<InputIconInformer aria-label="Field help" renderContent={() => 'Hint text'} />);

    const informer = screen.getByRole('button', { name: 'Field help' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(informer);

    expect(screen.getByRole('dialog')).toHaveTextContent('Hint text');
  });
});
