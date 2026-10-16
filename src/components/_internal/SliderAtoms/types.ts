import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

import type { RuleSet } from 'styled-components';

import type { SLIDER_DIMENSIONS, SLIDER_THUMB_APPEARANCES } from './constants';
import type { DataAttributes } from '../../../utils/dataAttributes';

export type SliderAtomDimension = (typeof SLIDER_DIMENSIONS)[number];
export type SliderThumbAppearance = (typeof SLIDER_THUMB_APPEARANCES)[number];

/** Атрибуты нативного ползунка; значением, границами и disabled управляет компонент. */
export type NativeSliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'children' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'disabled'
> &
  DataAttributes;

export interface SliderBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'children' | 'onChange'
> {
  onValueChange: (value: number) => void;
  dimension: SliderAtomDimension;
  appearance: SliderThumbAppearance;
  position: number;
  showTooltip: boolean;
  tooltipContent: ReactNode;
  segmentPositions?: readonly number[];
  /** Разрешённые значения для режима step=null. */
  allowedValues?: readonly number[];
  /** Внутренний style helper дорожки; без него используется сплошная дорожка. */
  trackStyles?: RuleSet<SliderTrackStyleProps>;
  /** Скрывает дорожку при использовании общей дорожки диапазона. */
  hideTrack?: boolean;
  /** Только ползунок принимает pointer-события; используется для наложенных range-input. */
  thumbOnly?: boolean;
}

export interface SliderScaleProps {
  onSelect: (value: number) => void;
  disabled?: boolean;
  dimension: SliderAtomDimension;
  hasStart?: boolean;
  hasEnd?: boolean;
  values: readonly number[];
  currentValue?: number;
  renderMarks?: ((value: number) => ReactNode) | null;
  min: number;
  max: number;
}

export interface SliderControlLayoutProps {
  dimension: SliderAtomDimension;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children: ReactNode;
}

/** Владелец передаёт нормализованные границы, шаг и упорядоченные значения. */
export interface SliderRangeBaseProps {
  dimension: SliderAtomDimension;
  appearance: SliderThumbAppearance;
  min: number;
  max: number;
  step: number;
  value: readonly [number, number];
  onChange: (value: [number, number]) => void;
  disabled: boolean;
  showTooltip: boolean;
  lowerTooltipContent: ReactNode;
  upperTooltipContent: ReactNode;
  /** Доступные имена и HTML-атрибуты каждого ползунка задаёт владелец композиции. */
  lowerNativeSliderProps?: NativeSliderProps;
  upperNativeSliderProps?: NativeSliderProps;
  lowerNativeSliderRef?: Ref<HTMLInputElement>;
  upperNativeSliderRef?: Ref<HTMLInputElement>;
}

export interface SliderTrackStyleProps {
  $dimension: SliderAtomDimension;
  $segmentPositions?: readonly number[];
}
