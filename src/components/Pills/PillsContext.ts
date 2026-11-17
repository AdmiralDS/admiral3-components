import { createContext, type RefObject } from 'react';

export interface PillRegistration {
  id: string;
  ref: RefObject<HTMLButtonElement | null>;
  disabled: boolean;
}

export interface PillsContextValue {
  focusablePillId: string | null;
  registerPill: (pill: PillRegistration) => (() => void) | undefined;
  updatePill: (id: string, disabled: boolean) => void;
}

export const PillsContext = createContext<PillsContextValue | null>(null);
