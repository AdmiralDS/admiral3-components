import type { HTMLAttributes } from 'react';

import type { PULSE_DIMENSIONS, PULSE_STATUSES } from './constants';

/** Размер Pulse. */
export type PulseDimension = (typeof PULSE_DIMENSIONS)[number];

/** Статус Pulse, определяющий цвет компонента. */
export type PulseStatus = (typeof PULSE_STATUSES)[number];

/** Пользовательский цвет Pulse. */
export interface PulseColorConfig {
  /** Цвет основания и анимированной волны. */
  backgroundColor: string;
}

export interface PulseProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. */
  dimension?: PulseDimension;
  /** Статус компонента или пользовательский цвет. */
  status?: PulseStatus | PulseColorConfig;
}

export interface StyledPulseProps {
  $colorConfig?: PulseColorConfig;
  $dimension: PulseDimension;
  $status: PulseStatus;
}
