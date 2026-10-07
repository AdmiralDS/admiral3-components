import type { HTMLAttributes, ReactNode } from 'react';

import type { CHIPS_APPEARANCES, CHIPS_COLOR_MODES, CHIPS_DIMENSIONS } from './constants';

export type ChipDimension = (typeof CHIPS_DIMENSIONS)[number];
export type ChipAppearance = (typeof CHIPS_APPEARANCES)[number];
export type ChipColorMode = (typeof CHIPS_COLOR_MODES)[number];

export interface ChipBaseProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. По умолчанию 'm'. */
  dimension?: ChipDimension;
  /** Вид чипса. По умолчанию 'outlined'. */
  appearance?: ChipAppearance;
  /** Цветовой режим. По умолчанию 'colored'. */
  colorMode?: ChipColorMode;
  /** Иконки или другие декоративные элементы перед контентом чипса. */
  iconsBefore?: ReactNode;
  /** Аватар перед текстом чипса. Если задан iconsBefore, отображается после него. */
  avatar?: ReactNode;
  /** Число, которое будет отображено в компоненте Badge справа от контента. */
  badge?: number;
  /** Только для чтения. Блокирует переданные обработчики событий; у RemovableChip скрывает кнопку удаления. */
  readOnly?: boolean;
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

export interface SelectableChipProps extends ChipBaseProps {
  /** Выбранное состояние чипса. */
  selected?: boolean;
  /** Отключённое состояние. Блокирует обработчики событий onClick и onKeyDown, остальные обработчики событий блокируются на строне пользователя. */
  disabled?: boolean;
  /** Только для чтения. Блокирует переданные обработчики событий */
  readOnly?: boolean;
  /** Иконки или другие декоративные элементы после контента чипса. */
  iconsAfter?: ReactNode;
  /** Обработчик изменения выбранного состояния при клике или нажатии Enter/Space. */
  onChangeSelected?: (selected: boolean) => void;
}

export interface RemovableChipProps extends ChipBaseProps {
  /** Обработчик удаления. */
  onClose: () => void;
  /** Отключённое состояние. Блокирует обработчики событий onClose и onKeyDown. */
  disabled?: boolean;
  /** Props кнопки закрытия. */
  closeButtonProps?: HTMLAttributes<SVGSVGElement>;
  /** Только для чтения. Блокирует переданные обработчики событий и скрывает кнопку удаления. */
  readOnly?: boolean;
}

export interface StyledBaseChipProps {
  $colorMode: ChipColorMode;
  $disabled?: boolean;
  $dimension: ChipDimension;
  $appearance?: ChipAppearance;
  $readOnly?: boolean;
}

export interface StyledSelectableChipProps extends StyledBaseChipProps {
  $selected?: boolean;
}

export type ChipDimensionStyleProps = Pick<StyledBaseChipProps, '$dimension'>;
export type ChipTypographyStyleProps = Pick<
  StyledBaseChipProps,
  '$colorMode' | '$appearance' | '$dimension' | '$disabled'
>;
export type ChipActionsStyleProps = Pick<StyledSelectableChipProps, '$colorMode' | '$appearance' | '$selected'>;
export type ChipColorsStyleProps = Pick<
  StyledBaseChipProps,
  '$colorMode' | '$appearance' | '$dimension' | '$disabled' | '$readOnly'
>;
