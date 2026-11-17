export const FLOATING_WIDTH_MODES = ['content', 'target'] as const;

export type FloatingWidthMode = (typeof FLOATING_WIDTH_MODES)[number];
