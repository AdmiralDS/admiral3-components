import { createContext } from 'react';

import type { FieldSetDimension } from '../FieldSet';

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  dimension: FieldSetDimension;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
