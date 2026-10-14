export const TAG_DIMENSIONS = ['l', 'm', 's', 'xs'] as const;
export const TAG_STATUSES = ['neutral', 'info', 'success', 'error', 'warning', 'attention'] as const;

export const TAG_DIMENSION_PARAMETRS = {
  l: { height: 32, paddingBlock: 5, paddingInline: 11 },
  m: { height: 24, paddingBlock: 3, paddingInline: 7 },
  s: { height: 20, paddingBlock: 1, paddingInline: 5 },
  xs: { height: 16, paddingBlock: 0, paddingInline: 5 },
} as const;
