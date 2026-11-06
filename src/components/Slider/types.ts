import type { HTMLAttributes, ReactNode, Ref } from 'react';

import type { NativeSliderProps, SliderAtomDimension, SliderThumbAppearance } from '../_internal/SliderAtoms';

export type SliderMarks = readonly number[];

export type SliderDimension = SliderAtomDimension;
export type { NativeSliderProps, SliderThumbAppearance };

/** HTML-атрибуты и основной ref относятся к контейнеру. */
export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'defaultValue'> {
  /** Размер компонента. По умолчанию 'm'. */
  dimension?: SliderDimension;
  /** Минимальное значение. По умолчанию 0. */
  min?: number;
  /** Максимальное значение. По умолчанию 100. */
  max?: number;
  /** Положительный шаг относительно min без marks. При наличии marks игнорируется. По умолчанию 1. */
  step?: number;
  /** Точки выбора: дорожка сегментирована, доступны только переданные значения. Вне min/max отметки игнорируются. */
  marks?: SliderMarks;
  /** Значение в controlled-режиме. */
  value?: number;
  /** Начальное значение в uncontrolled-режиме. По умолчанию min. */
  defaultValue?: number;
  /** Вызывается при изменении значения пользователем. */
  onChange?: (value: number) => void;
  /** Отключает взаимодействие с компонентом. */
  disabled?: boolean;
  /** Подпись над дорожкой, задающая доступное имя ползунка. */
  label?: ReactNode;
  /** Показывает Tooltip при hover/press и на 2 секунды после изменения с клавиатуры. По умолчанию false. */
  showTooltip?: boolean;
  /** Вид ползунка. По умолчанию 'stroke'. */
  thumbAppearance?: SliderThumbAppearance;
  /** Декоративная иконка в начале дорожки. */
  iconStart?: ReactNode;
  /** Декоративная иконка в конце дорожки. */
  iconEnd?: ReactNode;
  /**
   * Формат значения рядом с label и содержимого Tooltip.
   * undefined: используется дефолтное преобразование — String(value),
   * null или () => null: value не отображается; Tooltip использует дефолтное преобразование - String(value).
   */
  renderValue?: ((value: number) => ReactNode) | null;
  /**
   * Формат подписей под шкалой, включая min/max.
   * undefined: используется дефолтное преобразование — String(value),
   * null — не отображать подписи.
   */
  renderMarks?: ((value: number) => ReactNode) | null;
  /** Атрибуты нативного ползунка, включая id, name, form, ARIA и обработчики событий. */
  nativeSliderProps?: NativeSliderProps;
  /** Ref нативного ползунка. */
  nativeSliderRef?: Ref<HTMLInputElement>;
}
