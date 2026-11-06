import { createContext } from 'react';

import type { StepperProps, StepperStatusLabels } from './types';

export interface StepperContextValue {
  index: number;
  active: boolean;
  dimension: NonNullable<StepperProps['dimension']>;
  orientation: NonNullable<StepperProps['orientation']>;
  colorMode: NonNullable<StepperProps['colorMode']>;
  lineClamp: NonNullable<StepperProps['lineClamp']>;
  hideLine: boolean;
  onStepChange: StepperProps['onStepChange'];
  statusLabels: StepperStatusLabels;
}

export const StepperContext = createContext<StepperContextValue | null>(null);
