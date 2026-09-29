import { textStyles } from '@admiral-ds/admiral3-tokens';

export const CHIPS_DIMENSIONS = ['s', 'm', 'l'] as const;

export const CHIPS_APPEARANCES = ['flat', 'outlined'] as const;
export const CHIPS_COLOR_MODES = ['colored', 'neutral'] as const;

export const CHIPS_DIMENSION_PARAMETERS = {
  s: {
    height: 20,
    iconSize: 16,
    textHeight: 16,
    contentPadding: 2,
    typography: textStyles.caption.caption1,
  },
  m: {
    height: 24,
    iconSize: 16,
    textHeight: 16,
    contentPadding: 4,
    typography: textStyles.caption.caption1,
  },
  l: {
    height: 32,
    iconSize: 20,
    textHeight: 20,
    contentPadding: 6,
    typography: textStyles.body.body2Long,
  },
} as const;
