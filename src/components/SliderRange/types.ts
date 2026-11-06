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
  /** Минимальное расстояние в единицах значения. По умолчанию 0. Во время drag не ограничивает сближение; после отпускания корректируется активная граница. Клавиатура учитывает зазор сразу. Положительное расстояние округляется вверх до step и ограничивается доступным диапазоном. */
  minValueDistance?: number;
  /** Текущий интервал. Нижняя граница не может превышать верхнюю. */
  value?: SliderRangeValue;
  /** Начальный интервал для uncontrolled-режима. По умолчанию [min, max]. */
  defaultValue?: SliderRangeValue;
  /** Передаёт упорядоченный интервал при изменении пользователем. При allowSwap ползунки меняют роли при перетаскивании через соседа. Клавиатура ограничивает значение соседней границей. */
  onChange?: (value: [number, number]) => void;
  disabled?: boolean;
  /** Разрешает обмен ролями при перетаскивании через соседний ползунок. При false границы могут совпадать, но не пересекаются. По умолчанию true. */
  allowSwap?: boolean;
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
  /** Ref текущего нижнего ползунка. При обмене ролей указывает на другой DOM-input. */
  lowerNativeSliderRef?: Ref<HTMLInputElement>;
  /** Ref текущего верхнего ползунка. При обмене ролей указывает на другой DOM-input. */
  upperNativeSliderRef?: Ref<HTMLInputElement>;
}
