import type { HTMLAttributes, ReactNode } from 'react';

import type { CHIPS_APPEARANCES, CHIPS_COLOR_MODES, CHIPS_DIMENSIONS } from './constants';
import type { IconPlacementAppearance, IconPlacementDimension, IconPlacementProps } from './IconPlacement';

export type ChipDimension = (typeof CHIPS_DIMENSIONS)[number];
export type ChipAppearance = (typeof CHIPS_APPEARANCES)[number];
export type ChipColorMode = (typeof CHIPS_COLOR_MODES)[number];

export interface ChipsProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: ChipDimension;
  /** Отключённое состояние. Блокирует переданные Chips обработчики событий и удаление. */
  disabled?: boolean;
  /** Вид чипса. По умолчанию outlined. */
  appearance?: ChipAppearance;
  /** Цветовой режим. По умолчанию colored. */
  colorMode?: ChipColorMode;
  /** Выбранное состояние чипса. Игнорируется, если передан onClose. */
  selected?: boolean;
  /** Обработчик удаления. Добавляет кнопку закрытия и отключает режим selected. */
  onClose?: () => void;
  /** Иконки или другие декоративные элементы перед текстом Chips. Содержимое слота скрыто от скринридера. */
  iconsBefore?: ReactNode;
  /** Аватар перед текстом Chips. Если задан iconsBefore, отображается после него. */
  avatar?: ReactNode;
  /** Число, которое будет отображено в компоненте Badge справа от контента. */
  badge?: number;
  /** Только для чтения. Блокирует переданные Chips обработчики событий и скрывает кнопку удаления. */
  readOnly?: boolean;
  /** Props кнопки закрытия. */
  closeButtonProps?: IconPlacementProps;
  //TODO поправить описание при добавлении компонента Tooltip
  /** Функция, которая возвращает реакт-компонент с контентом tooltip, сейчас используется нативный title в качестве tooltip, поэтому функция должна возвращать string. Если этому компоненту нужны props, используйте замыкание */
  renderContentTooltip?: () => string;
  //TODO добавить в примитивное children значение number при добавлении компонента Tooltip
  /**
   * Отключение Tooltip.
   * При true:
   * - не навешиваются hover/focus-слушатели для показа/скрытия Tooltip,
   * - не выполняются проверки переполнения (overflow) контента для тултипа.
   * При false:
   * - если передан renderContentTooltip, будет показан кастомный контент тултипа,
   * - иначе при примитивном children (string) будет показано его значение,
   */
  disabledTooltip?: boolean;
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
