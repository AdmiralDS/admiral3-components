export const PULSE_DIMENSIONS = ['s', 'm', 'l'] as const;

export const PULSE_STATUSES = ['info', 'error', 'success', 'warning'] as const;

export const PULSE_DIMENSION_PARAMETERS: Record<(typeof PULSE_DIMENSIONS)[number], { size: number; waveSize: number }> =
  {
    s: { size: 8, waveSize: 6 },
    m: { size: 12, waveSize: 10 },
    l: { size: 16, waveSize: 14 },
  };
