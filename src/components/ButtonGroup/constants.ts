import { BUTTON_APPEARANCES, BUTTON_COLOR_MODES, BUTTON_DIMENSIONS } from '../Button/constants';
import type { ButtonAppearance, ButtonColorMode, ButtonDimension } from '../Button/types';

export const BUTTON_GROUP_DIMENSIONS: readonly ButtonDimension[] = BUTTON_DIMENSIONS;

export const BUTTON_GROUP_APPEARANCES: readonly Exclude<ButtonAppearance, 'ghost'>[] = BUTTON_APPEARANCES.filter(
  (appearance): appearance is Exclude<ButtonAppearance, 'ghost'> => appearance !== 'ghost',
);

export const BUTTON_GROUP_COLOR_MODES: readonly Exclude<ButtonColorMode, 'staticWhite'>[] = BUTTON_COLOR_MODES.filter(
  (colorMode): colorMode is Exclude<ButtonColorMode, 'staticWhite'> => colorMode !== 'staticWhite',
);
