import type { HTMLAttributes, ReactNode } from 'react';

import type { css } from 'styled-components';

import type { FORM_ITEM_DIMENSIONS, FORM_ITEM_STATUSES } from './constants';

export type FormItemDimension = (typeof FORM_ITEM_DIMENSIONS)[number];
export type FormItemStatus = (typeof FORM_ITEM_STATUSES)[number];

export interface FormItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Подпись одиночного поля. Без подписи доступное имя задаётся на самом поле, например через aria-label. */
  label?: ReactNode;
  /** Дополнительный текст справа от подписи. Не входит в доступное имя поля. */
  additionalLabel?: ReactNode;
  /** CSS-миксины для переопределения стилей подписей и описания. */
  labelCssMixins?: {
    /** CSS-миксин основной подписи. */
    label?: ReturnType<typeof css>;
    /** CSS-миксин дополнительной подписи. */
    additionalLabel?: ReturnType<typeof css>;
    /** CSS-миксин описания под полем. */
    description?: ReturnType<typeof css>;
  };
  /** Включает нативную подсказку с полным строковым текстом при его переполнении. */
  visibleLabelTooltips?: {
    /** Включает подсказку основной подписи. */
    label?: boolean;
    /** Включает подсказку дополнительной подписи. */
    additionalLabel?: boolean;
    /** Включает подсказку описания под полем. */
    description?: boolean;
  };
  /** Должен совпадать с id нативного поля для связи с подписью. id поля задаётся отдельно. */
  htmlFor?: string;
  /**
   * Подсказка или сообщение о результате проверки под полем.
   * Для связи с полем задайте id на элементе внутри description и укажите его в aria-describedby самого поля.
   */
  description?: ReactNode;
  /** Статус пояснения и вложенного Input. Имеет приоритет над status инпута; error задаёт ему aria-invalid. */
  status?: FormItemStatus;
  /** Максимальное количество символов. Передаётся вложенному Input и включает счётчик справа под полем. */
  maxLength?: number;
  /** Порог появления счётчика от 0 до 1. По умолчанию 0.8. */
  counterThreshold?: number;
  /** Показывает звёздочку и задаёт required вложенному Input. По умолчанию false, включая вложенный Input. */
  required?: boolean;
  /** Оформляет тексты и задаёт disabled вложенному Input. По умолчанию false, включая вложенный Input. */
  disabled?: boolean;
  /** Задаёт readOnly вложенному Input. По умолчанию false, включая вложенный Input. */
  readOnly?: boolean;
  /** Размер подписей и отступов (по умолчанию 'm'). Значение обёртки приоритетнее dimension вложенного Input. */
  dimension?: FormItemDimension;
  /**
   * Одно поле, при необходимости с обёрткой. Input получает настройки обёртки через контекст, включая значения по умолчанию.
   * Нативным и сторонним полям настройки передаются вручную. Для групп используйте RadioGroup или CheckBoxGroup.
   */
  children: ReactNode;
}
