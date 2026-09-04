import type { AriaAttributes, ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from 'react';

import type { DataAttributes } from '../../utils/dataAttributes';
import type { BaseInputAppearance, BaseInputDimension, BaseInputStatus } from '../_internal/InputAtoms/types';

export type InputDimension = BaseInputDimension;
export type InputAppearance = BaseInputAppearance;
export type InputStatus = BaseInputStatus;
export type InputType = 'text' | 'password' | 'email' | 'url';

export type InputContainerProps = HTMLAttributes<HTMLDivElement> & DataAttributes;

export type InputClearButtonProps = AriaAttributes &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'id' | 'className' | 'title' | 'tabIndex'> &
  DataAttributes;

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'children' | 'prefix' | 'suffix' | 'type'
> {
  /** Поддерживаемый нативный тип поля. Значение по умолчанию 'text'. */
  type?: InputType;
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: InputDimension;
  /** Внешний вид поля. Значение по умолчанию 'standard'. */
  appearance?: InputAppearance;
  /** Статус поля. */
  status?: InputStatus;
  /**
   * Пользовательское содержимое перед нативным полем ввода. Input не управляет его видимостью, интерактивностью и
   * участием в Tab-порядке в состояниях disabled и readOnly. Потребитель должен явно передать disabled, tabIndex или
   * скрыть содержимое, если его поведение должно следовать состоянию поля.
   */
  iconsBefore?: ReactNode;
  /**
   * Пользовательское содержимое после нативного поля ввода, расположенное после динамической иконки очистки. Input не
   * управляет его видимостью, интерактивностью и участием в Tab-порядке в состояниях disabled и readOnly. Потребитель
   * должен явно передать disabled, tabIndex или скрыть содержимое, если его поведение должно следовать состоянию поля.
   */
  iconsAfter?: ReactNode;
  /** Отображает кнопку очистки, когда поле содержит значение. Кнопка скрыта в состояниях disabled и readOnly. */
  showClearIcon?: boolean;
  /** Вызывается после очистки значения и отправки обычного события изменения поля. */
  onClear?: () => void;
  /** Безопасные HTML- и ARIA-атрибуты кнопки очистки. */
  clearButtonProps?: InputClearButtonProps;
  /** Содержимое в начале поля перед иконками и нативным полем ввода. */
  prefix?: ReactNode;
  /** Содержимое в конце поля после нативного поля ввода и иконок. */
  suffix?: ReactNode;
  /** Отображает разделитель рядом с префиксом и суффиксом. Значение по умолчанию 'true'. */
  showAffixDivider?: boolean;
  /** Отображает подсказку с полным значением при переполнении поля. Значение по умолчанию 'true'. */
  showTooltip?: boolean;
  /** HTML-атрибуты корневого контейнера. Нативные атрибуты верхнего уровня по-прежнему передаются в input. */
  containerProps?: InputContainerProps;
  /** Ref корневого контейнера. Основной ref компонента по-прежнему указывает на нативный input. */
  containerRef?: Ref<HTMLDivElement>;
}
