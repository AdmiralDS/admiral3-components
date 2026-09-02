import { cornerRadiusOptions, type CornerRadiusBase, type ThemeMode } from '@admiral-ds/admiral3-tokens';

export type StorybookSimpleTheme = 'light' | 'dark';
export type StorybookAdmiralTheme = 'system' | ThemeMode;
export type StorybookAdmiralCssTheme = 'light' | 'dark' | 'light-neutral' | 'dark-neutral';

const admiralCssThemes: Record<ThemeMode, StorybookAdmiralCssTheme> = {
  light: 'light',
  dark: 'dark',
  lightNeutral: 'light-neutral',
  darkNeutral: 'dark-neutral',
};

export const storybookAdmiralThemes: StorybookAdmiralTheme[] = [
  'system',
  'light',
  'dark',
  'lightNeutral',
  'darkNeutral',
];

export const isStorybookAdmiralTheme = (theme: unknown): theme is StorybookAdmiralTheme => {
  return typeof theme === 'string' && storybookAdmiralThemes.includes(theme as StorybookAdmiralTheme);
};

export const isStorybookCornerRadius = (cornerRadius: unknown): cornerRadius is CornerRadiusBase => {
  return typeof cornerRadius === 'string' && cornerRadiusOptions.includes(cornerRadius as CornerRadiusBase);
};

export const getPreferredSimpleTheme = (): StorybookSimpleTheme => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const resolveAdmiralTheme = (
  theme: StorybookAdmiralTheme,
  preferredTheme: StorybookSimpleTheme = getPreferredSimpleTheme(),
): ThemeMode => {
  return theme === 'system' ? preferredTheme : theme;
};

export const resolveStorybookShellTheme = (
  theme: StorybookAdmiralTheme,
  preferredTheme: StorybookSimpleTheme = getPreferredSimpleTheme(),
): StorybookSimpleTheme => {
  const resolvedTheme = resolveAdmiralTheme(theme, preferredTheme);

  return resolvedTheme === 'dark' || resolvedTheme === 'darkNeutral' ? 'dark' : 'light';
};

export const resolveAdmiralCssTheme = (
  theme: StorybookAdmiralTheme,
  preferredTheme: StorybookSimpleTheme = getPreferredSimpleTheme(),
): StorybookAdmiralCssTheme => {
  return admiralCssThemes[resolveAdmiralTheme(theme, preferredTheme)];
};
