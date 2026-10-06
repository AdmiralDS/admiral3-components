import type { ButtonHTMLAttributes } from 'react';

import type { ICON_PLACEMENT_DIMENSIONS, ICON_PLACEMENT_COLOR_MODES } from './constants';

export type IconPlacementDimension = (typeof ICON_PLACEMENT_DIMENSIONS)[number];
export type IconPlacementColorMode = (typeof ICON_PLACEMENT_COLOR_MODES)[number];

interface ColorConfig {
  iconColor?: string;
}

export interface IconPlacementProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Размер кнопки */
  dimension?: IconPlacementDimension;
  /** Отключение кнопки */
  disabled?: boolean;
  //** Отключает вызов onKeyDown нажитиями на клавиши Enter и Space. Если выключен то событие onKeyDown срабатывает только на клавишах Enter и Space */
  disableKeyboardActivation?: boolean;
  /** Цветовой режим. По умолчанию 'colored'. */
  colorMode?: IconPlacementColorMode | ColorConfig;
}

export interface IconPlacementButtonStyleProps {
  $colorMode: IconPlacementProps['colorMode'];
  $dimension: IconPlacementDimension;
}
