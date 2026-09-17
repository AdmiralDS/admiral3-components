import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

import type { PILLS_APPEARANCES } from './constants';

/** Цветовой вариант Pill. */
export type PillAppearance = (typeof PILLS_APPEARANCES)[number];

/** Пользовательские цвета Pill. */
export interface PillColorConfig {
  /** Цвет фона Pill. */
  backgroundColor: string;
  /** Цвет текста и иконок Pill. */
  textColor: string;
}

export interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Цветовой вариант Pill или пользовательские цвета. Значение по умолчанию 'neutral1'. */
  appearance?: PillAppearance | PillColorConfig;
}

/**
 * Группа Pill с горизонтальной клавиатурной навигацией.
 * Доступное имя задаётся через aria-label или aria-labelledby. Прямыми дочерними элементами должны быть Pill.
 */
export interface PillsProps extends HTMLAttributes<HTMLDivElement> {
  /** Объединяет Pill без промежутков и оставляет скругления только по краям группы. */
  connected?: boolean;
}

export interface StyledPillProps {
  $appearance: PillAppearance;
  $colorConfig?: PillColorConfig;
}

export interface StyledPillsProps {
  $connected: boolean;
}
