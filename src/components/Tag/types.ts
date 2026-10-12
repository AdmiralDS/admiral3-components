import type { HTMLAttributes } from 'react';

import type { ComponentStyleConfig } from '#src/types';

import type { TAG_DIMENSIONS } from './constants';

/** Размер Tag. */
export type TagDimension = (typeof TAG_DIMENSIONS)[number];
/** Статус, определяющий цветовое оформление Tag. */
export type TagStatus = 'info' | 'success' | 'error' | 'warning' | 'attention';
/** Способ отображения статуса Tag: цветной фон или статусная метка на нейтральном фоне. */
export type TagAppearance = 'colored' | 'neutral';

/** Пользовательская стилизация Tag при appearance='colored'. */
export interface TagColorConfig {
  /** Стили фона Tag. */
  background: ComponentStyleConfig;
  /** Стили обводки Tag */
  border?: ComponentStyleConfig;
  /** Стили фона Tag при наведении. */
  backgroundHover?: ComponentStyleConfig;
  /** Стили фона Tag при нажатии. */
  backgroundPress?: ComponentStyleConfig;
  /** Стили цвета текста Tag. */
  textColor?: ComponentStyleConfig;
}

interface BaseTagProps extends HTMLAttributes<HTMLButtonElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TagDimension;
  //todo 1 или несколько иконок? Нужно продумать пропс для иконки под TagMenu?
  /** Иконки перед содержимым Tag. Отображаются только при appearance='colored'. */
  iconsBefore?: React.ReactNode;
  /** Параметр включения обводки */
  withBorder?: boolean;
}

/** Свойства Tag с допустимыми статусами для каждого варианта оформления. */
export type TagProps = BaseTagProps &
  (
    | {
        /** Отображение статуса через цвет фона и обводки, если она включена. */
        appearance: 'colored';
        /** Предустановленный статус Tag или пользовательская стилизация. */
        status?: TagStatus | TagColorConfig;
      }
    | {
        /** Отображение статуса через цветную метку слева от содержимого на нейтральном фоне. */
        appearance: 'neutral';
        /** Предустановленный статус цветной метки. */
        status?: TagStatus;
      }
  );

export interface StyledTagProps {
  $dimension: TagDimension;
}
