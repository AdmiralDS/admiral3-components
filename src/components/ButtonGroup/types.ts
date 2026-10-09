import type { HTMLAttributes } from 'react';

import type { BUTTON_GROUP_APPEARANCES, BUTTON_GROUP_COLOR_MODES, BUTTON_GROUP_DIMENSIONS } from './constants';
import type { ButtonColorConfig } from '../Button/types';

/** Цветовой вариант ButtonGroup. */
export type ButtonGroupAppearance = (typeof BUTTON_GROUP_APPEARANCES)[number];

/** Режим цветового окрашивания ButtonGroup. */
export type ButtonGroupColorMode = (typeof BUTTON_GROUP_COLOR_MODES)[number];

/** Размер ButtonGroup. */
export type ButtonGroupDimension = (typeof BUTTON_GROUP_DIMENSIONS)[number];

/** Пользовательские цвета всех Button внутри ButtonGroup. */
export type ButtonGroupColorConfig = ButtonColorConfig;

/**
 * Группа связанных действий с горизонтальной клавиатурной навигацией.
 * Доступное имя задаётся через aria-label или aria-labelledby.
 * Прямыми дочерними элементами должны быть Button.
 */
export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-orientation'> {
  /** Цветовой вариант всех Button в группе. Значение по умолчанию 'solid'. */
  appearance?: ButtonGroupAppearance;
  /** Режим цветового окрашивания всех Button в группе. Значение по умолчанию 'colored'. */
  colorMode?: ButtonGroupColorMode;
  /** Размер всех Button в группе. Значение по умолчанию 'm'. */
  dimension?: ButtonGroupDimension;
  /**
   * Пользовательские цвета всех Button в группе.
   * Настройка отдельной Button игнорируется, пока она находится внутри ButtonGroup.
   */
  colorConfig?: ButtonGroupColorConfig;
}

export interface StyledButtonGroupProps {
  $appearance: ButtonGroupAppearance;
  $colorMode: ButtonGroupColorMode;
  $colorConfig?: ButtonGroupColorConfig;
}
