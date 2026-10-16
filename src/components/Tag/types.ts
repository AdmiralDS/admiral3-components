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

export interface TagDotProps extends HTMLAttributes<HTMLButtonElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TagDimension;
  /** Параметр включения обводки */
  withBorder?: boolean;
  /** Статус, определяющий цветовое оформление Tag. */
  status?: TagStatus;
}

export interface TagTintedProps extends TagDotProps {
  /** Иконки перед содержимым Tag. Отображаются только В TagTinted. */
  iconsBefore?: React.ReactNode;
}

export interface StyledTagWrapperProps {
  $dimension: TagDimension;
  $clickable: boolean;
  $status?: TagStatus;
  $withBorder: boolean;
}
