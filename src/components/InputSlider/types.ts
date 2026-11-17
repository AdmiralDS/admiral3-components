import type { HTMLAttributes, Ref } from 'react';

import type { INPUT_SLIDER_DIMENSIONS } from './constants';
import type { InputProps, InputStatus } from '../Input';
import type { SliderProps } from '../Slider';

export type InputSliderDimension = (typeof INPUT_SLIDER_DIMENSIONS)[number];

/** HTML-атрибуты и основной ref относятся к div-обёртке. */
export interface InputSliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange' | 'defaultValue'
> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: InputSliderDimension;
  /** Отключает обе части компонента. Настройка FormItem имеет приоритет. */
  disabled?: boolean;
  /** Оставляет только поле для чтения. Настройка FormItem имеет приоритет. */
  readOnly?: boolean;
  /** Статус поля ввода. Явный status у FormItem имеет приоритет. */
  status?: InputStatus;
  /** Нативная обязательность поля ввода. required у FormItem имеет приоритет, включая false по умолчанию. */
  required?: boolean;
  /** Исходная числовая строка без форматирования в controlled-режиме. Пустое значение — ''. */
  value?: string;
  /** Начальное значение без форматирования в uncontrolled-режиме. По умолчанию первая допустимая отметка либо String(min). */
  defaultValue?: string;
  /** Изменение исходной строки через поле или Slider; очистка передаёт ''. Невалидный ввод не изменяет value. */
  onValueChange?: (value: string) => void;
  /** Имя исходного значения в форме. Отправляется без форматирования; пустота и невалидный текст — пустой строкой. */
  name?: string;
  /** id внешней формы для отправки значения, валидации и reset. */
  form?: string;
  /** Форматирует исходное число для отображения, в том числе после нормализации на blur. По умолчанию String. */
  formatValue?: (value: number) => string;
  /** Преобразует непустой текст в число. null/NaN/Infinity означают невалидный ввод и блокируют submit. Пустота обрабатывается отдельно как null. По умолчанию Number с проверкой конечности. */
  parseValue?: (value: string) => number | null;
  /** Минимальное допустимое число для поля и Slider. По умолчанию 0. */
  min?: number;
  /** Максимальное допустимое число для поля и Slider. По умолчанию 100. */
  max?: number;
  /** Положительный шаг слайдера относительно min. При наличии marks слайдер использует их. По умолчанию 1. */
  step?: number;
  /** Допустимые точки выбора. На blur число приводится к ближайшей отметке; при равном расстоянии выбирается большая. Пустота сохраняется. */
  marks?: SliderProps['marks'];
  /** Настройки видимого Input, включая id, ARIA и нативные onChange/onInput. События содержат отображаемый текст; name/form задаются сверху. */
  inputProps?: Omit<
    InputProps,
    | 'value'
    | 'defaultValue'
    | 'name'
    | 'form'
    | 'type'
    | 'min'
    | 'max'
    | 'step'
    | 'dimension'
    | 'disabled'
    | 'readOnly'
    | 'containerRef'
    | 'status'
    | 'required'
  >;
  /**
   * Настройки отображения и нативного input слайдера. По умолчанию Tooltip включён.
   * Доступное имя берётся из inputProps[aria-labelledby] / inputProps[aria-label]; по умолчанию — «Выбор значения».
   * name/form задаются сверху. Только скрытое поле исходного значения имеет name.
   */
  sliderProps?: Omit<
    SliderProps,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'min'
    | 'max'
    | 'step'
    | 'marks'
    | 'dimension'
    | 'disabled'
    | 'label'
    | 'nativeSliderRef'
    | 'nativeSliderProps'
  > & {
    nativeSliderProps?: Omit<NonNullable<SliderProps['nativeSliderProps']>, 'name' | 'form'>;
  };
  /** Ref нативного текстового input. */
  nativeInputRef?: Ref<HTMLInputElement>;
  /** Ref нативного input слайдера. В readOnly слайдер не монтируется. */
  nativeSliderRef?: Ref<HTMLInputElement>;
}
