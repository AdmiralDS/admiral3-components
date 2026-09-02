import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';

import { buildTheme, cornerRadiusOptions, type BuiltTheme, type CornerRadiusBase } from '@admiral-ds/admiral3-tokens';
import '@admiral-ds/admiral3-tokens/css';
import { FontsSourceCodePro, FontsVTBGroup } from '@admiral-ds/admiral3-tokens/fonts';
import type { Preview } from '@storybook/react-vite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { DocsThemeContainer } from './DocsThemeContainer';
import {
  getPreferredSimpleTheme,
  isStorybookAdmiralTheme,
  isStorybookCornerRadius,
  resolveAdmiralCssTheme,
  resolveAdmiralTheme,
  resolveStorybookShellTheme,
  type StorybookAdmiralTheme,
} from './storybookThemes';
import './preview.css';

const StorybookRadiusVariables = createGlobalStyle<{ $radius: BuiltTheme['radius'] }>`
  body {
    --admiral-radius-small: ${({ $radius }) => $radius.small};
    --admiral-radius-medium: ${({ $radius }) => $radius.medium};
    --admiral-radius-large: ${({ $radius }) => $radius.large};
  }
`;

const PreviewThemeShell = ({
  Story,
  selectedCornerRadius,
  selectedTheme,
}: {
  Story: ComponentType;
  selectedCornerRadius: CornerRadiusBase;
  selectedTheme: StorybookAdmiralTheme;
}) => {
  const [preferredTheme, setPreferredTheme] = useState(getPreferredSimpleTheme);
  const theme = resolveAdmiralTheme(selectedTheme, preferredTheme);
  const cssTheme = resolveAdmiralCssTheme(selectedTheme, preferredTheme);
  const shellTheme = resolveStorybookShellTheme(selectedTheme, preferredTheme);
  const admiralTheme = buildTheme(theme, { cornerRadius: selectedCornerRadius });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setPreferredTheme(getPreferredSimpleTheme());

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.body.classList.remove('sb-theme-light', 'sb-theme-dark');
    document.body.classList.add(`sb-theme-${shellTheme}`);
    document.body.dataset.admiralTheme = cssTheme;
  }, [cssTheme, shellTheme]);

  return (
    <ThemeProvider theme={admiralTheme}>
      <StorybookRadiusVariables $radius={admiralTheme.radius} />
      <FontsVTBGroup />
      <FontsSourceCodePro />
      <Story />
    </ThemeProvider>
  );
};

const PreviewThemeDecorator = (
  Story: ComponentType,
  context: { globals: { cornerRadius?: string; theme?: string } },
) => {
  const selectedTheme = isStorybookAdmiralTheme(context.globals.theme) ? context.globals.theme : 'system';
  const selectedCornerRadius = isStorybookCornerRadius(context.globals.cornerRadius)
    ? context.globals.cornerRadius
    : '4';

  return <PreviewThemeShell Story={Story} selectedCornerRadius={selectedCornerRadius} selectedTheme={selectedTheme} />;
};

const CanvasLayoutDecorator = (Story: ComponentType, context: { viewMode?: string }) => {
  if (context.viewMode !== 'story') {
    return <Story />;
  }

  return (
    <div className="story-canvas">
      <Story />
    </div>
  );
};

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [PreviewThemeDecorator, CanvasLayoutDecorator],
  initialGlobals: {
    cornerRadius: '4',
    theme: 'system',
  },
  globalTypes: {
    cornerRadius: {
      description: 'Corner radius base',
      toolbar: {
        title: 'Corner radius',
        icon: 'circlehollow',
        items: cornerRadiusOptions.map((value) => ({ value, title: `Radius ${value}` })),
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Preview theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'lightNeutral', title: 'Light Neutral' },
          { value: 'dark', title: 'Dark' },
          { value: 'darkNeutral', title: 'Dark Neutral' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    a11y: {
      test: 'error',
    },
    layout: 'fullscreen',
    docs: {
      container: DocsThemeContainer,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
