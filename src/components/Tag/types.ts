import type { ButtonHTMLAttributes } from 'react';

import type { TAG_DIMENSIONS, TAG_STATUSES } from './constants';
import type { BadgeDotProps } from '../BadgeDot';

export type TagDimension = (typeof TAG_DIMENSIONS)[number];
export type TagStatus = (typeof TAG_STATUSES)[number];

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
  backgroundColor?: BackgroundColorConfig;
  /** Стили обводки Tag */
  borderColor?: string;
  /** Стили цвета текста Tag. */
  textColor?: string;
}

export interface TagDotColorConfig extends TagColorConfig {
  /** Цветовое оформление точки. */
  dotAppearance?: BadgeDotProps['appearance'];
}

export type TagTintedStatus = TagStatus | TagColorConfig;
export type TagDotStatus = TagStatus | TagDotColorConfig;

interface TagBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TagDimension;
  /** Параметр включения обводки */
  withBorder?: boolean;
}

export interface TagTintedProps extends TagBaseProps {
  /** Статус, определяющий цветовое оформление Tag. Значение по умолчанию 'neutral'. */
  status?: TagTintedStatus;
  /** Иконки перед содержимым Tag. */
  iconsBefore?: React.ReactNode;
}

export interface TagDotProps extends TagBaseProps {
  /** Статус, определяющий цветовое оформление Tag. Значение по умолчанию 'neutral'. */
  status?: TagDotStatus;
}

export interface StyledTagWrapperProps {
  $dimension: TagDimension;
  $clickable: boolean;
  $status: TagStatus;
  $colorConfig?: TagColorConfig;
  $withBorder: boolean;
}
