import { createContext, type RefObject } from 'react';

export interface PillRegistration {
  id: symbol;
  ref: RefObject<HTMLButtonElement | null>;
  disabled: boolean;
}

export interface PillsContextValue {
  focusablePillId: symbol | null;
  registerPill: (pill: PillRegistration) => (() => void) | undefined;
  updatePill: (id: symbol, disabled: boolean) => void;
}

export const PillsContext = createContext<PillsContextValue | null>(null);
