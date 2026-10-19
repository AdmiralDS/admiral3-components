import { createRef } from 'react';

import { themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, render, screen } from '@testing-library/react';
import type { ExecutionContext } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { Badge } from './Badge';
import { BADGE_APPEARANCES, BADGE_DIMENSIONS, BADGE_DIMENSION_PARAMETERS } from './constants';
import { badgeBackgroundColors, badgeTextColors, badgeTypography } from './style';
import type { BadgeDimension } from './types';

const getBadgeDimensionStyles = (dimension: BadgeDimension) => {
  const { size, horizontalPadding } = BADGE_DIMENSION_PARAMETERS[dimension];

  return {
    minWidth: `${size}px`,
    height: `${size}px`,
    padding: `0 ${horizontalPadding}px`,
  };
};

const getBadgeTypographyStyles = (dimension: BadgeDimension) => ({
  fontSize: badgeTypography[dimension].fontSize,
  lineHeight: badgeTypography[dimension].lineHeight,
});

const resolveToken = (token: (context: ExecutionContext) => string, theme = themes.light) => {
  return token({ theme } as ExecutionContext);
};

describe('Badge', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders content', () => {
    render(<Badge data-testid="badge">5</Badge>);

    expect(screen.getByTestId('badge')).toHaveTextContent('5');
  });

  it('forwards div attributes to the root element', () => {
    render(
      <Badge data-testid="badge" title="Notifications">
        5
      </Badge>,
    );

    expect(screen.getByTestId('badge')).toHaveAttribute('title', 'Notifications');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Badge ref={ref} data-testid="badge">
        5
      </Badge>,
    );

    expect(ref.current).toBe(screen.getByTestId('badge'));
  });

  it('uses default neutral1 appearance and M dimension', () => {
    render(<Badge data-testid="badge">5</Badge>);

    expect(screen.getByTestId('badge')).toHaveStyle({
      ...getBadgeDimensionStyles('m'),
      borderRadius: 'var(--Round, 1000px)',
      backgroundColor: resolveToken(badgeBackgroundColors.neutral1),
      color: resolveToken(badgeTextColors.neutral1),
    });
  });

  it.each(BADGE_DIMENSIONS)('applies %s dimension', (dimension) => {
    render(<Badge data-testid="badge" dimension={dimension} />);

    expect(screen.getByTestId('badge')).toHaveStyle(getBadgeDimensionStyles(dimension));
  });

  it.each(BADGE_DIMENSIONS)('applies %s typography', (dimension) => {
    render(<Badge data-testid="badge" dimension={dimension} />);

    expect(screen.getByTestId('badge')).toHaveStyle(getBadgeTypographyStyles(dimension));
  });

  it.each(BADGE_APPEARANCES)('uses Admiral CSS tokens for %s appearance', (appearance) => {
    render(<Badge appearance={appearance} data-testid="badge" />);

    expect(screen.getByTestId('badge')).toHaveStyle({
      backgroundColor: resolveToken(badgeBackgroundColors[appearance]),
      color: resolveToken(badgeTextColors[appearance]),
    });
  });

  it('uses current styled-components theme as CSS token fallback', () => {
    render(
      <ThemeProvider theme={themes.dark}>
        <Badge appearance="info" data-testid="badge">
          5
        </Badge>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('badge')).toHaveStyle({
      backgroundColor: resolveToken(badgeBackgroundColors.info, themes.dark),
      color: resolveToken(badgeTextColors.info, themes.dark),
    });
  });

  it('uses custom color config', () => {
    render(
      <Badge
        appearance={{ backgroundColor: 'var(--custom-badge-background)', textColor: 'var(--custom-badge-text)' }}
        data-testid="badge"
      />,
    );

    expect(screen.getByTestId('badge')).toHaveAttribute('data-appearance', 'custom');
    expect(screen.getByTestId('badge')).toHaveStyle({
      backgroundColor: 'var(--custom-badge-background)',
      color: 'var(--custom-badge-text)',
    });
  });
});
