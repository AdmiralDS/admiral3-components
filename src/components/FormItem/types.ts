import type { HTMLAttributes, ReactNode } from 'react';

import type { FORM_ITEM_DIMENSIONS, FORM_ITEM_STATUSES } from './constants';

export type FormItemDimension = (typeof FORM_ITEM_DIMENSIONS)[number];
export type FormItemStatus = (typeof FORM_ITEM_STATUSES)[number];

export interface FormItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Подпись одиночного поля. */
  label: ReactNode;
  /** Дополнительный текст справа от подписи поля. */
  additionalLabel?: ReactNode;
  /** id нативного поля, с которым связана подпись. */
  htmlFor?: string;
  /** Подсказка или сообщение о результате проверки под полем. */
  description?: ReactNode;
  /** Цветовой статус пояснения. Без статуса используется обычный цвет. */
  status?: FormItemStatus;
  /** Содержимое справа под полем, например счётчик символов. */
  counter?: ReactNode;
  /** Отображает признак обязательного поля. Не задаёт правило валидации. */
  required?: boolean;
  /** Размер подписей и отступов. Должен соответствовать размеру поля. По умолчанию 'm'. */
  dimension?: FormItemDimension;
  /** Содержимое поля. Его props не изменяются. */
  children: ReactNode;
}

export interface StyledFormItemProps {
  $dimension: FormItemDimension;
}

export interface StyledFormItemDescriptionProps extends StyledFormItemProps {
  $status?: FormItemStatus;
}

export interface StyledFormItemLabelProps extends StyledFormItemProps {
  $required: boolean;
}
