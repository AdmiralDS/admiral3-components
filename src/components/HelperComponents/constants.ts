export const SELECTION_CONTROL_INFORMER_DIMENSIONS = ['m', 's', 'xs'] as const;

export const SELECTION_CONTROL_INFORMER_SIZES: Record<(typeof SELECTION_CONTROL_INFORMER_DIMENSIONS)[number], number> =
  {
    m: 24,
    s: 20,
    xs: 16,
  };
