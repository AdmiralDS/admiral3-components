import { createContext } from 'react';

import type { CheckBoxDimension } from './types';

export interface CheckBoxGroupContextValue {
  value: string[];
  dimension: CheckBoxDimension;
  disabled: boolean;
  readOnly: boolean;
}

export const CheckBoxGroupContext = createContext<CheckBoxGroupContextValue | null>(null);
