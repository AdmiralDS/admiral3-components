import { createRef } from 'react';

import { themes, textStyles } from '@admiral-ds/admiral3-tokens';
import { cleanup, render, screen } from '@testing-library/react';
import type { ExecutionContext } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { PILLS_APPEARANCES, PILLS_CONTENT_GAP, PILLS_HEIGHT, PILLS_HORIZONTAL_PADDING } from './constants';
import { Pill } from './Pill';
import { pillBackgroundColors, pillBorderRadius, pillTextColors } from './style';

const resolveToken = (token: (context: ExecutionContext) => string, theme = themes.light) => {
  return token({ theme } as ExecutionContext);
};

describe('Pill', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders text, numeric and composed content', () => {
    const { rerender } = render(<Pill data-testid="pill">Status</Pill>);

    expect(screen.getByTestId('pill')).toHaveTextContent('Status');

    rerender(<Pill data-testid="pill">{0}</Pill>);
    expect(screen.getByTestId('pill')).toHaveTextContent('0');

    rerender(
      <Pill data-testid="pill">
        <svg aria-hidden="true" data-testid="icon" />
        Status
      </Pill>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards native button attributes and ref', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Pill ref={ref} aria-label="Current status" className="consumer-class" data-testid="pill" />);

    const pill = screen.getByTestId('pill');

    expect(pill.tagName).toBe('BUTTON');
    expect(pill).toHaveAttribute('type', 'button');
    expect(pill).toHaveAttribute('aria-label', 'Current status');
    expect(pill).toHaveAttribute('data-pill', '');
    expect(pill).toHaveClass('consumer-class');
    expect(ref.current).toBe(pill);
  });

  it('uses default neutral1 appearance and compact geometry', () => {
    render(<Pill data-testid="pill">Status</Pill>);

    expect(screen.getByTestId('pill')).toHaveAttribute('data-appearance', 'neutral1');
    expect(screen.getByTestId('pill')).toHaveStyle({
      height: `${PILLS_HEIGHT}px`,
      padding: `0 ${PILLS_HORIZONTAL_PADDING}px`,
      gap: `${PILLS_CONTENT_GAP}px`,
      borderRadius: resolveToken(pillBorderRadius),
      backgroundColor: resolveToken(pillBackgroundColors.neutral1),
      color: resolveToken(pillTextColors.neutral1),
      cursor: 'pointer',
      fontSize: textStyles.caption.caption1.fontSize,
      lineHeight: textStyles.caption.caption1.lineHeight,
    });
  });

  it.each(PILLS_APPEARANCES)('uses Admiral CSS tokens for %s appearance', (appearance) => {
    render(
      <Pill appearance={appearance} data-testid="pill">
        Status
      </Pill>,
    );

    expect(screen.getByTestId('pill')).toHaveAttribute('data-appearance', appearance);
    expect(screen.getByTestId('pill')).toHaveStyle({
      backgroundColor: resolveToken(pillBackgroundColors[appearance]),
      color: resolveToken(pillTextColors[appearance]),
    });
  });

  it('uses current styled-components theme as CSS token fallback', () => {
    render(
      <ThemeProvider theme={themes.dark}>
        <Pill appearance="info1" data-testid="pill">
          Status
        </Pill>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('pill')).toHaveStyle({
      backgroundColor: resolveToken(pillBackgroundColors.info1, themes.dark),
      color: resolveToken(pillTextColors.info1, themes.dark),
    });
  });

  it('uses custom colors without forwarding the config to the DOM', () => {
    render(
      <Pill
        appearance={{ backgroundColor: 'var(--custom-pill-background)', textColor: 'var(--custom-pill-text)' }}
        data-testid="pill"
      >
        Status
      </Pill>,
    );

    const pill = screen.getByTestId('pill');

    expect(pill).toHaveAttribute('data-appearance', 'custom');
    expect(pill).not.toHaveAttribute('appearance');
    expect(pill).toHaveStyle({
      backgroundColor: 'var(--custom-pill-background)',
      color: 'var(--custom-pill-text)',
    });
  });

  it('is focusable through its native button semantics', () => {
    render(<Pill data-testid="pill">Status</Pill>);

    const pill = screen.getByTestId('pill');
    pill.focus();

    expect(pill).toHaveFocus();
    expect(pill).toHaveAccessibleName('Status');
  });
});
