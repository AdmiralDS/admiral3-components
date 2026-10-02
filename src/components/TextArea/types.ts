import type { AriaAttributes, ButtonHTMLAttributes, HTMLAttributes, Ref, TextareaHTMLAttributes } from 'react';

import type { DataAttributes } from '../../utils/dataAttributes';
import type { BaseInputAppearance, BaseInputDimension, BaseInputStatus } from '../_internal/InputAtoms';

export type TextAreaDimension = BaseInputDimension;
export type TextAreaAppearance = BaseInputAppearance;
export type TextAreaStatus = BaseInputStatus;
export type TextAreaContainerProps = HTMLAttributes<HTMLDivElement> & DataAttributes;
export type TextAreaActionButtonProps = AriaAttributes &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'id' | 'className' | 'title' | 'tabIndex'> &
  DataAttributes;

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Размер поля. По умолчанию 'm'. Настройки FormItem имеют приоритет. */
  dimension?: TextAreaDimension;
  /** Внешний вид поля. По умолчанию 'standard'. */
  appearance?: TextAreaAppearance;
  /** Статус поля. Явный status у FormItem имеет приоритет. */
  status?: TextAreaStatus;
  /** disabled у FormItem имеет приоритет, включая значение по умолчанию false. */
  disabled?: boolean;
  /** readOnly у FormItem имеет приоритет, включая значение по умолчанию false. */
  readOnly?: boolean;
  /** required у FormItem имеет приоритет, включая значение по умолчанию false. */
  required?: boolean;
  /** Нативное ограничение длины. Явный maxLength у FormItem имеет приоритет. */
  maxLength?: number;
  /** Автоматически изменяет высоту по содержимому; отключает ручной resize. По умолчанию false. */
  autoHeight?: boolean;
  /** Минимальное количество строк. По умолчанию rows или 2. */
  minRows?: number;
  /** Максимальное количество строк; при превышении появляется скролл. */
  maxRows?: number;
  /** Разрешает нативное изменение высоты в пределах minRows/maxRows. По умолчанию false. */
  resize?: boolean;
  /** Показывает очистку непустого поля; скрыта при disabled/readOnly и showCopyIcon. */
  showClearIcon?: boolean;
  /** Показывает копирование непустого поля, включая readOnly. Имеет приоритет над очисткой. */
  showCopyIcon?: boolean;
  /** Вызывается после очистки и отправки нативного события input. */
  onClear?: () => void;
  /** Безопасные HTML- и ARIA-атрибуты кнопки очистки. */
  clearButtonProps?: TextAreaActionButtonProps;
  /** Безопасные HTML- и ARIA-атрибуты кнопки копирования. */
  copyButtonProps?: TextAreaActionButtonProps;
  /** Атрибуты контейнера. Атрибуты верхнего уровня относятся к нативному textarea. */
  containerProps?: TextAreaContainerProps;
  /** Ref контейнера. Основной ref указывает на textarea. */
  containerRef?: Ref<HTMLDivElement>;
}

export interface NativeTextAreaStyleProps {
  $minRows: number;
  $maxRows?: number;
  $resize: boolean;
}
