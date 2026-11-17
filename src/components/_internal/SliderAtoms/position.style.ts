import type { CSSProperties } from 'react';

import { SLIDER_DIMENSION_PARAMETERS } from './constants';
import type { SliderAtomDimension } from './types';

type SliderPositionStyle = CSSProperties & {
  '--slider-position': string;
  '--slider-fill-stop': string;
  '--slider-track-start-color': string;
  '--slider-track-end-color': string;
};

/** Меняем положение без создания CSS-класса для каждого посещённого значения. */
export const getSliderPositionStyle = (position: number, style?: CSSProperties): SliderPositionStyle => ({
  ...style,
  '--slider-position': `${position}%`,
  '--slider-fill-stop': `${position}%`,
  '--slider-track-start-color': position === 0 ? 'var(--slider-subtle)' : 'var(--slider-fill)',
  '--slider-track-end-color': position === 100 ? 'var(--slider-fill)' : 'var(--slider-subtle)',
});

type SliderRangePositionStyle = CSSProperties & {
  '--slider-lower-position': string;
  '--slider-upper-position': string;
};

export const getSliderRangePositionStyle = (
  lower: number,
  upper: number,
  dimension: SliderAtomDimension,
): SliderRangePositionStyle => {
  const radius = SLIDER_DIMENSION_PARAMETERS[dimension].thumbSize / 2;
  // Проценты относятся к области движения центра thumb, а градиент включает крайние отрезки.
  return {
    '--slider-lower-position': `calc(${lower}% + ${radius * (1 - (2 * lower) / 100)}px)`,
    '--slider-upper-position': `calc(${upper}% + ${radius * (1 - (2 * upper) / 100)}px)`,
  };
};
