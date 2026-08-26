import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const currentDir = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(currentDir, '../src');
const entryPath = resolve(srcPath, 'index.ts');
const storybookTsconfigPath = resolve(currentDir, '../tsconfig.storybook.json');

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: storybookTsconfigPath,
      include: ['src/**/*.tsx', '.storybook/**/*.tsx'],
      exclude: ['**/*.stories.tsx'],
      propFilter: (prop) => {
        return prop.parent ? !/node_modules/.test(prop.parent.fileName) : true;
      },
    },
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          '#src': srcPath,
          '@admiral-ds/admiral3-components': entryPath,
        },
      },
    });
  },
};

export default config;
