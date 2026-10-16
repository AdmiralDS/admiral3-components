export const AVATAR_DIMENSIONS = ['m', 's'] as const;

export const AVATAR_DIMENSION_PARAMETERS = {
  m: { minHeight: 40 },
  s: { minHeight: 32 },
} as const;
