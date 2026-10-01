import { createContext } from 'react';

import type { FormItemProps } from '../FormItem/types';

export type FormItemContextValue = Pick<
  FormItemProps,
  'dimension' | 'status' | 'disabled' | 'required' | 'readOnly' | 'maxLength'
> & {
  onCharacterCountChange?: (count: number) => void;
};

export const FormItemContext = createContext<FormItemContextValue | null>(null);
