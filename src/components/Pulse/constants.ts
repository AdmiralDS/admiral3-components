export const PULSE_DIMENSIONS = ['s', 'm', 'l'] as const;

export const PULSE_STATUSES = ['info', 'danger', 'success', 'warning'] as const;

export const PULSE_DIMENSION_PARAMETERS: Record<
  (typeof PULSE_DIMENSIONS)[number],
  { size: number; waveSize: number; animationName: string }
> = {
  s: { size: 8, waveSize: 6, animationName: 'pulse-animation-s' },
  m: { size: 12, waveSize: 10, animationName: 'pulse-animation-m' },
  l: { size: 16, waveSize: 14, animationName: 'pulse-animation-l' },
};
