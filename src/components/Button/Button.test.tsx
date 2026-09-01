import { createRef } from 'react';

import { buildTheme, themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ExecutionContext } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { getToken, solidColors } from './appearanceMixin/colors';
import { Button } from './Button';
import {
  BUTTON_APPEARANCES,
  BUTTON_DIMENSIONS,
  BUTTON_DIMENSION_PARAMETERS,
  BUTTON_PADDING,
  BUTTON_TYPOGRAPHY,
  SQUARE_BUTTON_PADDING,
} from './constants';
import type { ButtonDimension } from './types';
import { spinnerColors } from '../Spinner/style';

const getButtonDimensionStyles = (dimension: ButtonDimension) => ({
  height: `${BUTTON_DIMENSION_PARAMETERS[dimension]}px`,
  padding: BUTTON_PADDING[dimension],
});

const getSquareButtonDimensionStyles = (dimension: ButtonDimension) => ({
  height: `${BUTTON_DIMENSION_PARAMETERS[dimension]}px`,
  width: `${BUTTON_DIMENSION_PARAMETERS[dimension]}px`,
  padding: SQUARE_BUTTON_PADDING[dimension],
});

const getButtonTypographyStyles = (dimension: ButtonDimension) => ({
  fontSize: BUTTON_TYPOGRAPHY[dimension].fontSize,
  lineHeight: BUTTON_TYPOGRAPHY[dimension].lineHeight,
});

const resolveToken = (token: (context: ExecutionContext) => string, theme = themes.light) => {
  return token({ theme } as ExecutionContext);
};

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Button data-testid="button">Content</Button>);

    expect(screen.getByTestId('button')).toHaveTextContent('Content');
    expect(screen.getByText('Content').tagName).toBe('SPAN');
  });

  it('forwards button attributes to the root element', () => {
    render(
      <Button data-testid="button" title="Submit">
        Content
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('title', 'Submit');
    expect(screen.getByTestId('button')).toHaveAttribute('type', 'button');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Button ref={ref} data-testid="button">
        Content
      </Button>,
    );

    expect(ref.current).toBe(screen.getByTestId('button'));
  });

  it('uses default solid appearance, colored colorMode and M dimension', () => {
    render(<Button data-testid="button">Button</Button>);

    expect(screen.getByTestId('button')).toHaveAttribute('data-appearance', 'solid');
    expect(screen.getByTestId('button')).toHaveAttribute('data-dimension', 'm');
    expect(screen.getByTestId('button')).toHaveStyle({
      ...getButtonDimensionStyles('m'),
      backgroundColor: resolveToken(solidColors.colored.background),
      color: resolveToken(solidColors.colored.color),
    });
  });

  it.each(BUTTON_DIMENSIONS)('applies %s dimension', (dimension) => {
    render(
      <Button data-testid="button" dimension={dimension}>
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('data-dimension', dimension);
    expect(screen.getByTestId('button')).toHaveStyle(getButtonDimensionStyles(dimension));
  });

  it.each(BUTTON_DIMENSIONS)('applies %s typography', (dimension) => {
    render(
      <Button data-testid="button" dimension={dimension}>
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveStyle(getButtonTypographyStyles(dimension));
  });

  it.each(BUTTON_APPEARANCES)('uses Admiral CSS tokens for %s appearance with colored mode', (appearance) => {
    render(
      <Button appearance={appearance} colorMode="colored" data-testid="button">
        Button
      </Button>,
    );

    const colors = getToken(appearance).colored;

    expect(screen.getByTestId('button')).toHaveStyle({
      backgroundColor: resolveToken(colors.background!),
      color: resolveToken(colors.color!),
    });
  });

  it('uses current styled-components theme as CSS token fallback', () => {
    render(
      <ThemeProvider theme={themes.dark}>
        <Button appearance="solid" colorMode="neutral" data-testid="button">
          Button
        </Button>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('button')).toHaveStyle({
      backgroundColor: resolveToken(solidColors.neutral.background, themes.dark),
      color: resolveToken(solidColors.neutral.color, themes.dark),
    });
  });

  it('uses the medium radius group from the current theme', () => {
    render(
      <ThemeProvider theme={buildTheme('light', { cornerRadius: '8' })}>
        <Button data-testid="button">Button</Button>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('button')).toHaveStyle({
      borderRadius: 'var(--admiral-radius-medium, 8px)',
    });
  });

  it('uses custom color config', () => {
    render(
      <Button
        data-testid="button"
        colorConfig={{
          backgroundColor: {
            rest: 'var(--custom-button-background)',
            hover: 'var(--custom-button-background-hover)',
            press: 'var(--custom-button-background-press)',
          },
          textColor: 'var(--custom-button-text)',
        }}
      >
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('data-appearance', 'custom');
    expect(screen.getByTestId('button')).toHaveStyle({
      backgroundColor: 'var(--custom-button-background)',
      color: 'var(--custom-button-text)',
    });
  });

  it.each(BUTTON_DIMENSIONS)('applies %s square button dimensions', (dimension) => {
    render(
      <Button data-testid="button" dimension={dimension} square>
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveStyle(getSquareButtonDimensionStyles(dimension));
  });

  it('removes box-shadow for outline button in skeleton state', () => {
    render(
      <Button appearance="outline" skeleton data-testid="button">
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveStyle({ boxShadow: 'none' });
  });

  it('adds disabled appearance marker when inactive is true', () => {
    render(
      <Button data-testid="button" inactive>
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('data-appearance', 'solid disabled');
    expect(screen.getByTestId('button')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByTestId('button')).toHaveAttribute('tabindex', '0');
  });

  it('keeps inactive button clickable', () => {
    let clickCount = 0;
    render(
      <Button data-testid="button" inactive onClick={() => clickCount++}>
        Button
      </Button>,
    );

    fireEvent.click(screen.getByTestId('button'));

    expect(clickCount).toBe(1);
  });

  it.each(['loading', 'skeleton'] as const)('blocks click events in %s state', (state) => {
    let clickCount = 0;
    let parentClickCount = 0;
    const stateProps = { [state]: true };
    render(
      <div onClick={() => parentClickCount++}>
        <Button data-testid="button" onClick={() => clickCount++} {...stateProps}>
          Button
        </Button>
      </div>,
    );

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByTestId('button').dispatchEvent(clickEvent);

    expect(clickCount).toBe(0);
    expect(parentClickCount).toBe(0);
    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('makes a skeleton button unfocusable', () => {
    render(
      <Button data-testid="button" skeleton>
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('tabindex', '-1');
  });

  it.each([undefined, 'start', 'end'] as const)(
    'renders a decorative SVG loading icon in %s position',
    (loadingPosition) => {
      const { container } = render(
        <Button data-testid="button" loading loadingPosition={loadingPosition}>
          Button
        </Button>,
      );

      const icon = container.querySelector('svg');
      expect(icon).not.toBeNull();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveStyle({ width: '24px', height: '24px' });
    },
  );

  it.each([
    { dimension: 'l', spinnerDimension: 'm', size: 24 },
    { dimension: 'm', spinnerDimension: 'm', size: 24 },
    { dimension: 's', spinnerDimension: 's', size: 20 },
    { dimension: 'xs', spinnerDimension: 'xs', size: 16 },
  ] as const)(
    'uses $spinnerDimension spinner with $size px size for $dimension button',
    ({ dimension, spinnerDimension, size }) => {
      const { container } = render(
        <Button dimension={dimension} loading loadingPosition="start">
          Button
        </Button>,
      );

      const icon = container.querySelector('svg');
      expect(icon).toHaveStyle({ width: `${size}px`, height: `${size}px` });
      expect(container.querySelector(`path[data-dimension='${spinnerDimension}']`)).not.toHaveStyle({
        display: 'none',
      });
    },
  );

  it.each([
    { appearance: 'solid', colorMode: 'colored', spinnerAppearance: 'staticWhite' },
    { appearance: 'solid', colorMode: 'neutral', spinnerAppearance: 'inverted' },
    { appearance: 'outline', colorMode: 'colored', spinnerAppearance: 'colored' },
    { appearance: 'flat', colorMode: 'neutral', spinnerAppearance: 'neutral' },
    { appearance: 'ghost', colorMode: 'neutral', spinnerAppearance: 'neutral' },
  ] as const)(
    'uses $spinnerAppearance spinner color for $appearance/$colorMode button',
    ({ appearance, colorMode, spinnerAppearance }) => {
      const { container } = render(
        <Button appearance={appearance} colorMode={colorMode} loading>
          Button
        </Button>,
      );

      expect(container.querySelector('svg')).toHaveStyle({
        color: resolveToken(spinnerColors[spinnerAppearance]),
      });
    },
  );

  it('uses default aria-label when loading and accessible name is not provided', () => {
    render(
      <Button data-testid="button" loading>
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('aria-label', 'Загрузка...');
  });

  it('does not override aria-label when accessible name is provided', () => {
    render(
      <Button data-testid="button" loading aria-label="Save">
        Button
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('aria-label', 'Save');
  });
});
