import type { HTMLAttributes } from 'react';

import type { TAG_DIMENSIONS, TAG_STATUSES } from './constants';

export type TagDimension = (typeof TAG_DIMENSIONS)[number];
export type TagStatus = (typeof TAG_STATUSES)[number] | TagColorConfig;

interface BackgroundColorConfig {
  /** Базовый цвет фона Tag. */
  rest: string;
  /** Цвет фона Tag в состоянии hover. */
  hover?: string;
  /** Цвет фона Tag в состоянии press. */
  press?: string;
}

export interface TagColorConfig {
  /** Стили фона Tag. */
  background?: BackgroundColorConfig;
  /** Стили обводки Tag */
  border?: string;
  /** Стили цвета текста Tag. */
  textColor?: string;
  /** Стили цвета бейджа перед текстом, используется исключительно в TagDot. */
  dotColor?: string;
}

export interface TagProps extends HTMLAttributes<HTMLButtonElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TagDimension;
  /** Иконки перед содержимым Tag. Отображаются только при appearance='colored'. */
  iconsBefore?: React.ReactNode;
  /** Параметр включения обводки */
  withBorder?: boolean;
  /** Статус, определяющий цветовое оформление Tag. */
  status?: TagStatus;
}

export interface StyledTagWrapperProps {
  $dimension: TagDimension;
  $clickable: boolean;
  $status?: TagStatus;
  /** Статус для data-атрибута, не влияющий на цвет фона TagDot. */
  $withBorder: boolean;
}
