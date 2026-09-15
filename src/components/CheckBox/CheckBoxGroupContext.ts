import { createContext } from 'react';

import type { CheckBoxDimension } from './types';

export interface CheckBoxGroupContextValue {
  value: string[];
  dimension: CheckBoxDimension;
  disabled: boolean;
  readOnly: boolean;
  onItemChange: (value: string, checked: boolean) => void;
}

export const CheckBoxGroupContext = createContext<CheckBoxGroupContextValue | null>(null);
