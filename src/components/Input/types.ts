import type { HTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from 'react';

import type { BaseInputAppearance, BaseInputDimension, BaseInputStatus } from '../_internal/InputAtoms/types';

export type InputDimension = BaseInputDimension;
export type InputAppearance = BaseInputAppearance;
export type InputStatus = BaseInputStatus;

export type InputContainerProps = HTMLAttributes<HTMLDivElement> & {
  [attribute: `data-${string}`]: string | number | undefined;
};

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'children' | 'prefix' | 'suffix'
> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: InputDimension;
  /** Внешний вид поля. Значение по умолчанию 'standard'. */
  appearance?: InputAppearance;
  /** Статус поля. */
  status?: InputStatus;
  /**
   * Пользовательское содержимое перед нативным полем ввода. Input не управляет его видимостью, интерактивностью и
   * участием в Tab-порядке в состояниях disabled и readOnly.
   */
  iconsBefore?: ReactNode;
  /**
   * Пользовательское содержимое после нативного поля ввода, расположенное после динамической иконки очистки. Input не
   * управляет его видимостью, интерактивностью и участием в Tab-порядке в состояниях disabled и readOnly.
   */
  iconsAfter?: ReactNode;
  /** Отображает кнопку очистки, когда поле содержит значение. Кнопка скрыта в состояниях disabled и readOnly. */
  showClearIcon?: boolean;
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
