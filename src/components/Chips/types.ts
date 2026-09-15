import type { HTMLAttributes, ReactNode } from 'react';

import type { CHIPS_APPEARANCES, CHIPS_COLOR_MODES, CHIPS_DIMENSIONS } from './constants';
import type { IconPlacementAppearance, IconPlacementDimension } from './IconPlacement';

export type ChipDimension = (typeof CHIPS_DIMENSIONS)[number];
export type ChipAppearance = (typeof CHIPS_APPEARANCES)[number];
export type ChipColorMode = (typeof CHIPS_COLOR_MODES)[number];

export interface ChipsProps extends HTMLAttributes<HTMLDivElement> {
  /** Делает высоту компонента больше или меньше обычной. */
  dimension?: ChipDimension;
  /** Отключённое состояние. Пользовательские обработчики нужно блокировать на стороне потребителя. */
  disabled?: boolean;
  /** Вид чипса. */
  appearance?: ChipAppearance;
  /** Цветовой режим. По умолчанию neutral для flat и colored для outlined. */
  colorMode?: ChipColorMode;
  /** Выбранное состояние чипса */
  selected?: boolean;
  /** Добавляет иконку для удаления чипса. */
  onClose?: (id?: HTMLElement['id']) => void;
  /** Иконка перед текстом Chips. */
  iconStart?: ReactNode;
  /** Иконка после текста Chips. Отображается, если не передан метод onClose. */
  iconEnd?: ReactNode;
  /** Число, которое будет отображено в компоненте Badge справа от контента. */
  badge?: number;
  /** Только для чтения. Пользовательские обработчики блокирует потребитель. */
  readOnly?: boolean;
  /** Аватар перед текстом Chips. Если задан iconStart, отображается после него. Содержимое и оформление аватара задаёт потребитель. */
  avatar?: ReactNode;
}

export interface StyledChipProps {
  $colorMode: ChipColorMode;
  $disabled?: boolean;
  $dimension: ChipDimension;
  $appearance?: ChipAppearance;
  $selected?: boolean;
  $defaultChip?: boolean;
  $withCloseIcon?: boolean;
  $withBadge?: boolean;
  $withTooltip?: boolean;
  $clickable: boolean;
  $readOnly?: boolean;
}

export type ChipDimensionStyleProps = Pick<StyledChipProps, '$dimension'>;
export type ChipTypographyStyleProps = Pick<
  StyledChipProps,
  '$colorMode' | '$appearance' | '$dimension' | '$disabled' | '$selected'
>;
export type ChipActionsStyleProps = Pick<
  StyledChipProps,
  '$colorMode' | '$appearance' | '$selected' | '$withCloseIcon'
>;
export type ChipColorsStyleProps = Pick<
  StyledChipProps,
  | '$colorMode'
  | '$appearance'
  | '$clickable'
  | '$dimension'
  | '$disabled'
  | '$selected'
  | '$readOnly'
  | '$withCloseIcon'
>;

export interface StyledChipContentProps {
  $colorMode: ChipColorMode;
  $appearance?: ChipAppearance;
  $disabled?: boolean;
  $selected?: boolean;
  $dimension: ChipDimension;
  $withCloseIcon?: boolean;
}

export interface StyledIconWrapperProps {
  $dimension: ChipDimension;
}

export interface StyledCloseIconButtonProps {
  dimension: IconPlacementDimension;
  appearance: IconPlacementAppearance;
}
