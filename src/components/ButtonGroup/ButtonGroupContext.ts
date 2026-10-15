import { createContext, type RefObject } from 'react';

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
  focusableButtonId: symbol | null;
  registerButton: (button: ButtonGroupButtonRegistration) => (() => void) | undefined;
  updateButton: (id: symbol, state: ButtonGroupButtonState) => void;
}

export interface ButtonGroupButtonState {
  disabled: boolean;
  skeleton: boolean;
}

export interface ButtonGroupButtonRegistration extends ButtonGroupButtonState {
  id: symbol;
  ref: RefObject<HTMLButtonElement | null>;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
