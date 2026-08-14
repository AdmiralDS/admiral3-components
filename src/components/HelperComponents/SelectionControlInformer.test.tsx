import { ServiceInfoSolid } from '@admiral-ds/admiral3-icons';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SELECTION_CONTROL_INFORMER_DIMENSIONS, SELECTION_CONTROL_INFORMER_SIZES } from './constants';
import { SelectionControlInformer } from './SelectionControlInformer';
import { SelectionControlLayout } from './SelectionControlLayout';

describe('SelectionControlInformer', () => {
  afterEach(cleanup);

  it.each(SELECTION_CONTROL_INFORMER_DIMENSIONS)('renders %s dimension with a native title', (dimension) => {
    render(
      <SelectionControlInformer $dimension={dimension} title="Hint text" aria-label="Hint text">
        <ServiceInfoSolid />
      </SelectionControlInformer>,
    );

    const informer = screen.getByTitle('Hint text');

    expect(informer).toHaveAttribute('aria-label', 'Hint text');
    expect(informer).toHaveStyle({
      width: `${SELECTION_CONTROL_INFORMER_SIZES[dimension]}px`,
    });
  });

  it('provides a layout for external composition', () => {
    render(<SelectionControlLayout data-testid="selection-control-layout" />);

    expect(screen.getByTestId('selection-control-layout')).toHaveStyle({
      alignItems: 'flex-start',
      display: 'flex',
      gap: '4px',
    });
  });
});
