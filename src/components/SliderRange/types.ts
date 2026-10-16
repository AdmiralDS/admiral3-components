import type { HTMLAttributes, ReactNode, Ref } from 'react';

import type { SLIDER_RANGE_DIMENSIONS } from './constants';
import type { NativeSliderProps, SliderThumbAppearance } from '../_internal/SliderAtoms';

export type SliderRangeDimension = (typeof SLIDER_RANGE_DIMENSIONS)[number];
export type SliderRangeValue = readonly [number, number];
/** HTML-атрибуты и основной ref относятся к контейнеру; атрибуты ползунков задаются отдельно. */
export interface SliderRangeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange' | 'defaultValue'
> {
  /** Размер компонента. По умолчанию m. */
  dimension?: SliderRangeDimension;
  /** Визуальная подпись над дорожкой. Доступные имена задаются отдельно для каждого ползунка. */
  label?: ReactNode;
  /** Минимальное значение. По умолчанию 0. */
  min?: number;
  /** Максимальное значение. По умолчанию 100. */
  max?: number;
  /** Положительный шаг относительно min. По умолчанию 1. */
  step?: number;
  /** Текущий интервал. Нижняя граница не может превышать верхнюю. */
  value?: SliderRangeValue;
  /** Начальный интервал для uncontrolled-режима. По умолчанию [min, max]. */
  defaultValue?: SliderRangeValue;
  /** Вызывается только при изменении интервала пользователем. */
  onChange?: (value: [number, number]) => void;
  disabled?: boolean;
  /** Показывает Tooltip при hover/press и после клавиатурного изменения. По умолчанию false. */
  showTooltip?: boolean;
  thumbAppearance?: SliderThumbAppearance;
  /**
   * Форматирует каждую границу интервала рядом с label и в Tooltip соответствующего ползунка.
   * undefined — String(value). Функция получает число и возвращает ReactNode для обоих мест вывода.
   * null или пустой результат функции скрывает значение границы; её Tooltip использует String(value).
   * Пустой результат: null, undefined, boolean или ''. Число 0 отображается.
   */
  renderValue?: ((value: number) => ReactNode) | null;
  /**
   * Форматирует подписи min/max под шкалой.
   * undefined — String(value), null — не отображать подписи.
   */
  renderMarks?: ((value: number) => ReactNode) | null;
  /** Атрибуты нижнего ползунка, включая aria-label/aria-labelledby. form задаёт общую форму. */
  lowerNativeSliderProps?: NativeSliderProps;
  /** Атрибуты верхнего ползунка, включая aria-label/aria-labelledby. form берётся у нижнего ползунка. */
  upperNativeSliderProps?: NativeSliderProps;
  lowerNativeSliderRef?: Ref<HTMLInputElement>;
  upperNativeSliderRef?: Ref<HTMLInputElement>;
}
