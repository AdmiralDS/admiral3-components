export const DIVIDER_DIMENSIONS = ['m', 's'] as const;

export const DIVIDER_APPEARANCES = ['default', 'subtle', 'strong', 'primary', 'staticWhite'] as const;

export const DIVIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const DIVIDER_DIMENSION_PARAMETERS: Record<(typeof DIVIDER_DIMENSIONS)[number], number> = {
  m: 2,
  s: 1,
};
