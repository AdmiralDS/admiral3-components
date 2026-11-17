import { createContext } from 'react';
import type { RefObject } from 'react';

import type { StepperProps, StepperStatusLabels } from './types';

export interface StepRegistration {
  id: string;
  index: number;
  interactive: boolean;
  available: boolean;
  itemRef: RefObject<HTMLLIElement | null>;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

export interface StepperContextValue {
  stepId: string;
  index: number;
  active: boolean;
  dimension: NonNullable<StepperProps['dimension']>;
  orientation: NonNullable<StepperProps['orientation']>;
  colorMode: NonNullable<StepperProps['colorMode']>;
  lineClamp: NonNullable<StepperProps['lineClamp']>;
  hideLine: boolean;
  focusableStepId: string | null;
  onStepChange: StepperProps['onStepChange'];
  statusLabels: StepperStatusLabels;
  registerStep: (step: StepRegistration) => () => void;
}

export const StepperContext = createContext<StepperContextValue | null>(null);
