import { createContext } from 'react';

import type {
  ButtonGroupAppearance,
  ButtonGroupColorConfig,
  ButtonGroupColorMode,
  ButtonGroupDimension,
} from './types';

export interface ButtonGroupContextValue {
  appearance: ButtonGroupAppearance;
  colorMode: ButtonGroupColorMode;
  dimension: ButtonGroupDimension;
  colorConfig?: ButtonGroupColorConfig;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
