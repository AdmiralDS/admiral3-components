import type { HTMLAttributes, ReactNode } from 'react';

import type { FORM_ITEM_DIMENSIONS, FORM_ITEM_STATUSES } from './constants';

export type FormItemDimension = (typeof FORM_ITEM_DIMENSIONS)[number];
export type FormItemStatus = (typeof FORM_ITEM_STATUSES)[number];

export interface FormItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Подпись одиночного поля. Без подписи доступное имя задаётся на самом поле, например через aria-label. */
  label?: ReactNode;
  /** Дополнительный текст справа от подписи. Не входит в доступное имя поля. */
  additionalLabel?: ReactNode;
  /** Должен совпадать с id нативного поля для связи с подписью. id поля задаётся отдельно. */
  htmlFor?: string;
  /**
   * Подсказка или сообщение о результате проверки под полем.
   * Для связи с полем задайте id на элементе внутри description и укажите его в aria-describedby самого поля.
   */
  description?: ReactNode;
  /** Цветовой статус пояснения. Не задаёт status или aria-invalid дочернему полю. Без статуса используется обычный цвет. */
  status?: FormItemStatus;
  /** Счётчик справа под полем. Значение, порог появления и maxLength поля задаются потребителем. */
  counter?: ReactNode;
  /**
   * Отображает звёздочку обязательного поля.
   * Передайте required самому полю для нативной проверки или aria-required для валидации библиотекой форм.
   */
  required?: boolean;
  /** Оформляет подписи и пояснение как недоступные. Для поля disabled задаётся отдельно. */
  disabled?: boolean;
  /** Размер подписей и отступов. Должен соответствовать размеру поля. По умолчанию 'm'. */
  dimension?: FormItemDimension;
  /**
   * Одно поле, при необходимости с обёрткой. Его props не изменяются.
   * Для группы полей используйте FieldSet. readOnly задаётся непосредственно на поле.
   */
  children: ReactNode;
}
