import { createRef } from 'react';

import { themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, render, screen } from '@testing-library/react';
import type { ExecutionContext } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { BadgeDot } from './BadgeDot';
import { BADGE_DOT_APPEARANCES, BADGE_DOT_DIMENSIONS, BADGE_DOT_DIMENSION_PARAMETERS } from './constants';
import { badgeDotBackgroundColors } from './style';
import type { BadgeDotDimension } from './types';

const getBadgeDotDimensionStyles = (dimension: BadgeDotDimension) => {
  const size = BADGE_DOT_DIMENSION_PARAMETERS[dimension];

  return {
    width: `${size}px`,
    height: `${size}px`,
  };
};

const resolveToken = (token: (context: ExecutionContext) => string, theme = themes.light) => {
  return token({ theme } as ExecutionContext);
};

describe('BadgeDot', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders decorative BadgeDot by default', () => {
    render(<BadgeDot data-testid="badge-dot" />);

    expect(screen.getByTestId('badge-dot')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not hide dot when accessible name is provided', () => {
    render(<BadgeDot aria-label="Unread notifications" data-testid="badge-dot" />);

    expect(screen.getByTestId('badge-dot')).not.toHaveAttribute('aria-hidden');
  });

  it('keeps explicit aria-hidden value from user props', () => {
    render(<BadgeDot aria-hidden={false} data-testid="badge-dot" />);

    expect(screen.getByTestId('badge-dot')).toHaveAttribute('aria-hidden', 'false');
  });

  it('forwards div attributes to the root element', () => {
    render(<BadgeDot data-testid="badge-dot" title="Status" />);

    expect(screen.getByTestId('badge-dot')).toHaveAttribute('title', 'Status');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<BadgeDot ref={ref} data-testid="badge-dot" />);

    expect(ref.current).toBe(screen.getByTestId('badge-dot'));
  });

  it('uses default neutral appearance and 8px dimension', () => {
    render(<BadgeDot data-testid="badge-dot" />);

    const dot = screen.getByTestId('badge-dot');

    expect(dot).toHaveStyle({
      ...getBadgeDotDimensionStyles('m'),
      borderRadius: '50%',
      backgroundColor: resolveToken(badgeDotBackgroundColors.neutral),
    });
  });

  it.each(BADGE_DOT_DIMENSIONS)('applies %s dimension', (dimension) => {
    render(<BadgeDot data-testid="badge-dot" dimension={dimension} />);

    expect(screen.getByTestId('badge-dot')).toHaveStyle(getBadgeDotDimensionStyles(dimension));
  });

  it.each(BADGE_DOT_APPEARANCES)('uses Admiral CSS token for %s appearance', (appearance) => {
    render(<BadgeDot appearance={appearance} data-testid="badge-dot" />);

    expect(screen.getByTestId('badge-dot')).toHaveStyle({
      backgroundColor: resolveToken(badgeDotBackgroundColors[appearance]),
    });
  });

  it('uses current styled-components theme as CSS token fallback', () => {
    render(
      <ThemeProvider theme={themes.dark}>
        <BadgeDot appearance="info" data-testid="badge-dot" />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('badge-dot')).toHaveStyle({
      backgroundColor: resolveToken(badgeDotBackgroundColors.info, themes.dark),
    });
  });

  it('uses custom color config', () => {
    render(<BadgeDot appearance={{ backgroundColor: 'var(--custom-badge-dot-background)' }} data-testid="badge-dot" />);

    expect(screen.getByTestId('badge-dot')).toHaveAttribute('data-appearance', 'custom');
    expect(screen.getByTestId('badge-dot')).toHaveStyle({
      backgroundColor: 'var(--custom-badge-dot-background)',
    });
  });
});
