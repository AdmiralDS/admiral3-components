import type { HTMLAttributes, Ref } from 'react';

import type { INPUT_SLIDER_RANGE_DIMENSIONS } from './constants';
import type { InputProps, InputStatus } from '../Input';
import type { SliderRangeProps } from '../SliderRange';

export type InputSliderRangeDimension = (typeof INPUT_SLIDER_RANGE_DIMENSIONS)[number];

/** Нижняя и верхняя границы без форматирования. Пустое значение границы — ''. */
export type InputSliderRangeValue = readonly [string, string];

type RangeInputProps = Omit<
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

/** HTML-атрибуты и основной ref относятся к div-обёртке. */
export interface InputSliderRangeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange' | 'defaultValue'
> {
  /** Размер обоих полей. По умолчанию m; поля l используют SliderRange m. */
  dimension?: InputSliderRangeDimension;
  /** Отключает поля и слайдер. Настройка FormItem имеет приоритет. */
  disabled?: boolean;
  /** Оставляет только поля для чтения. Настройка FormItem имеет приоритет. */
  readOnly?: boolean;
  /** Статус обоих полей. Явный status у FormItem имеет приоритет. */
  status?: InputStatus;
  /** Нативная обязательность обоих полей. required у FormItem имеет приоритет. */
  required?: boolean;
  /** Исходные строки в controlled-режиме. Нижняя граница не может превышать верхнюю. */
  value?: InputSliderRangeValue;
  /** Начальный интервал без форматирования. По умолчанию [String(min), String(max)]. */
  defaultValue?: InputSliderRangeValue;
  /** Изменение исходных строк через поле или SliderRange. Невалидный ввод не изменяет value. */
  onValueChange?: (value: [string, string]) => void;
  /** Имя скрытого поля нижней границы в форме. Пустота и невалидный текст отправляются как ''. */
  lowerName?: string;
  /** Имя скрытого поля верхней границы в форме. Пустота и невалидный текст отправляются как ''. */
  upperName?: string;
  /** id общей внешней формы для submit, валидации и reset. */
  form?: string;
  /** Форматирует число для отображения. По умолчанию String. */
  formatValue?: (value: number) => string;
  /** Преобразует непустой текст в число. null/NaN/Infinity означают невалидный ввод. По умолчанию Number с проверкой конечности. */
  parseValue?: (value: string) => number | null;
  /** Минимальное число для обоих полей и слайдера. По умолчанию 0. */
  min?: number;
  /** Максимальное число для обоих полей и слайдера. По умолчанию 100. */
  max?: number;
  /** Положительный шаг слайдера относительно min. Ручной ввод не округляется по step. По умолчанию 1. */
  step?: number;
  /** Минимальное расстояние в единицах значения. По умолчанию step; 0 разрешает совпадение. Во время drag возможно временное сближение, после отпускания активная граница отскакивает по своей роли. Если у края ей не хватает места, зазор восстанавливается сдвигом соседа. Поля учитывают зазор при валидации и на blur. Зазор ограничен доступной длиной шкалы; при движении ползунка учитывается сетка step. */
  minValueDistance?: number;
  /** Настройки нижнего Input, включая id, ARIA и реальные onChange/onInput/onBlur видимого поля. */
  lowerInputProps?: RangeInputProps;
  /** Настройки верхнего Input, включая id, ARIA и реальные onChange/onInput/onBlur видимого поля. */
  upperInputProps?: RangeInputProps;
  /** Настройки отображения слайдера. Tooltip включён по умолчанию. name/form задаются на уровне композиции. */
  sliderProps?: Omit<
    SliderRangeProps,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'min'
    | 'max'
    | 'step'
    | 'minValueDistance'
    | 'dimension'
    | 'disabled'
    | 'label'
    | 'lowerNativeSliderRef'
    | 'upperNativeSliderRef'
    | 'lowerNativeSliderProps'
    | 'upperNativeSliderProps'
  > & {
    lowerNativeSliderProps?: Omit<NonNullable<SliderRangeProps['lowerNativeSliderProps']>, 'name' | 'form'>;
    upperNativeSliderProps?: Omit<NonNullable<SliderRangeProps['upperNativeSliderProps']>, 'name' | 'form'>;
  };
  /** Ref нативного текстового поля нижней границы. */
  lowerNativeInputRef?: Ref<HTMLInputElement>;
  /** Ref нативного текстового поля верхней границы. */
  upperNativeInputRef?: Ref<HTMLInputElement>;
  /** Ref текущего нижнего ползунка; при обмене ролей DOM-input меняется. В readOnly слайдер не монтируется. */
  lowerNativeSliderRef?: Ref<HTMLInputElement>;
  /** Ref текущего верхнего ползунка; при обмене ролей DOM-input меняется. В readOnly слайдер не монтируется. */
  upperNativeSliderRef?: Ref<HTMLInputElement>;
}
