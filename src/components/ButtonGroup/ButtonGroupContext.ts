import { createContext } from 'react';

import type { ButtonGroupAppearance, ButtonGroupColorMode, ButtonGroupDimension } from './types';

export interface ButtonGroupContextValue {
  appearance: ButtonGroupAppearance;
  colorMode: ButtonGroupColorMode;
  dimension: ButtonGroupDimension;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
