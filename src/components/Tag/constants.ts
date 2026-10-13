export const TAG_DIMENSIONS = ['l', 'm', 's', 'xs'] as const;

export const TAG_DIMENSION_PARAMETRS = {
  l: { height: 32, paddingBlock: 4, paddingInline: 10 },
  m: { height: 24, paddingBlock: 2, paddingInline: 6 },
  s: { height: 20, paddingBlock: 0, paddingInline: 4 },
  xs: { height: 16, paddingBlock: 0, paddingInline: 4 },
} as const;
