import { createRef } from 'react';

import { themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, render, screen } from '@testing-library/react';
import type { ExecutionContext } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { PULSE_DIMENSIONS, PULSE_DIMENSION_PARAMETERS, PULSE_STATUSES } from './constants';
import { Pulse } from './Pulse';
import { pulseBackgroundColors } from './style';

const resolveToken = (token: (context: ExecutionContext) => string, theme = themes.light) => {
  return token({ theme } as ExecutionContext).replace(', ', ',');
};

describe('Pulse', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders decorative Pulse by default', () => {
    render(<Pulse data-testid="pulse" />);

    expect(screen.getByTestId('pulse')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not hide Pulse when accessible name is provided', () => {
    render(<Pulse aria-label="Connection is active" data-testid="pulse" />);

    expect(screen.getByTestId('pulse')).not.toHaveAttribute('aria-hidden');
  });

  it('keeps explicit aria-hidden value from user props', () => {
    render(<Pulse aria-hidden={false} data-testid="pulse" />);

    expect(screen.getByTestId('pulse')).toHaveAttribute('aria-hidden', 'false');
  });

  it('forwards div attributes to the root element', () => {
    render(<Pulse data-testid="pulse" title="Connection status" />);

    expect(screen.getByTestId('pulse')).toHaveAttribute('title', 'Connection status');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Pulse ref={ref} data-testid="pulse" />);

    expect(ref.current).toBe(screen.getByTestId('pulse'));
  });

  it('uses default info status and M dimension', () => {
    render(<Pulse data-testid="pulse" />);

    expect(screen.getByTestId('pulse')).toHaveAttribute('data-status', 'info');
    expect(screen.getByTestId('pulse')).toHaveAttribute('data-dimension', 'm');
    expect(screen.getByTestId('pulse')).toHaveStyle({
      blockSize: '12px',
      inlineSize: '12px',
      borderRadius: '50%',
      '--pulse-color': resolveToken(pulseBackgroundColors.info),
      backgroundColor: 'var(--pulse-color)',
    });
  });

  it.each(PULSE_DIMENSIONS)('applies %s dimension', (dimension) => {
    render(<Pulse data-testid="pulse" dimension={dimension} />);

    const { size } = PULSE_DIMENSION_PARAMETERS[dimension];

    expect(screen.getByTestId('pulse')).toHaveAttribute('data-dimension', dimension);
    expect(screen.getByTestId('pulse')).toHaveStyle({
      blockSize: `${size}px`,
      inlineSize: `${size}px`,
    });
  });

  it.each(PULSE_STATUSES)('uses Admiral CSS token for %s status', (status) => {
    render(<Pulse data-testid="pulse" status={status} />);

    expect(screen.getByTestId('pulse')).toHaveAttribute('data-status', status);
    expect(screen.getByTestId('pulse')).toHaveStyle({
      '--pulse-color': resolveToken(pulseBackgroundColors[status]),
    });
  });

  it('uses current styled-components theme as CSS token fallback', () => {
    render(
      <ThemeProvider theme={themes.dark}>
        <Pulse data-testid="pulse" status="info" />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('pulse')).toHaveStyle({
      '--pulse-color': resolveToken(pulseBackgroundColors.info, themes.dark),
    });
  });

  it('uses custom color config', () => {
    render(<Pulse data-testid="pulse" status={{ backgroundColor: 'var(--custom-pulse-color)' }} />);

    expect(screen.getByTestId('pulse')).toHaveAttribute('data-status', 'custom');
    expect(screen.getByTestId('pulse')).toHaveStyle({
      '--pulse-color': 'var(--custom-pulse-color)',
    });
  });
});
