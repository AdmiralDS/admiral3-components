import type { HTMLAttributes, ReactNode } from 'react';

import type { FORM_ITEM_DIMENSIONS, FORM_ITEM_STATUSES } from './constants';

export type FormItemDimension = (typeof FORM_ITEM_DIMENSIONS)[number];
export type FormItemStatus = (typeof FORM_ITEM_STATUSES)[number];

export interface FormItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Подпись одиночного поля. Без подписи доступное имя задаётся на самом поле, например через aria-label. */
  label?: ReactNode;
  /** Дополнительный текст справа от подписи поля. */
  additionalLabel?: ReactNode;
  /** Должен совпадать с id нативного поля для связи с подписью. id поля задаётся отдельно. */
  htmlFor?: string;
  /**
   * Подсказка или сообщение о результате проверки под полем.
   * Для связи с полем задайте id на элементе внутри description и укажите его в aria-describedby самого поля.
   */
  description?: ReactNode;
  /** Цветовой статус пояснения. Без статуса используется обычный цвет. */
  status?: FormItemStatus;
  /** Счётчик символов справа под полем. */
  counter?: ReactNode;
  /** Отображает признак обязательного поля. Для нативной проверки required задаётся на самом поле отдельно. */
  required?: boolean;
  /** Оформляет подписи и пояснение как недоступные. Для поля disabled задаётся отдельно. */
  disabled?: boolean;
  /** Размер подписей и отступов. Должен соответствовать размеру поля. По умолчанию 'm'. */
  dimension?: FormItemDimension;
  /** Содержимое поля. Его props не изменяются. */
  children: ReactNode;
}

export interface StyledFormItemProps {
  $dimension: FormItemDimension;
  $disabled?: boolean;
}

export interface StyledFormItemDescriptionProps extends StyledFormItemProps {
  $status?: FormItemStatus;
}

export interface StyledFormItemLabelProps extends StyledFormItemProps {
  $required: boolean;
}
