import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { configs as storybookConfigs } from 'eslint-plugin-storybook';
import globals from 'globals';
import { configs as tseslintConfigs } from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'dist',
    'dist-playground',
    'storybook-static',
    'playwright-report',
    'test-results',
    'scripts/templates',
  ]),
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    extends: [
      js.configs.recommended,
      ...tseslintConfigs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/ignore': ['\\.(scss|less|css)$'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
      },
      'import/resolver': {
        typescript: {
          project: [
            './tsconfig.lib.json',
            './tsconfig.test.json',
            './tsconfig.storybook.json',
            './tsconfig.playground.json',
            './tsconfig.node.json',
          ],
          noWarnOnMultipleProjects: true,
        },
      },
    },
    rules: {
      'import/no-named-as-default': 'off',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'object'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '#src/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@admiral-ds/admiral3-components',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn'] }],
      'prettier/prettier': 'error',
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/no-duplicates': ['error', { considerQueryString: true }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['.storybook/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/*.stories.tsx'],
    rules: {
      'import/default': 'off',
    },
  },
  ...storybookConfigs['flat/recommended'],
  eslintPluginPrettierRecommended,
]);
