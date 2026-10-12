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
  /** Режим только для чтения. Блокирует основные действия компонента, сохраняя события наведения и фокуса. */
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
  /** Отключённое состояние. Блокирует onClick, onKeyDown и onSelectedChange. */
  disabled?: boolean;
  /** Режим только для чтения. Блокирует onClick, onKeyDown и onSelectedChange. */
  readOnly?: boolean;
  /** Иконки или другие декоративные элементы после контента чипса. */
  iconsAfter?: ReactNode;
  /** Обработчик изменения выбранного состояния при клике или нажатии Enter/Space. */
  onSelectedChange?: (selected: boolean) => void;
}

export interface RemovableChipProps extends ChipBaseProps {
  /** Обработчик удаления. */
  onClose: () => void;
  /** Отключённое состояние. Блокирует onClick, onKeyDown и onClose. */
  disabled?: boolean;
  /** Props кнопки закрытия. */
  closeButtonProps?: HTMLAttributes<SVGSVGElement>;
  /** Режим только для чтения. Блокирует onClick, onKeyDown и onClose, а также скрывает иконку удаления. */
  readOnly?: boolean;
}
