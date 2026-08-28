import { forwardRef, useMemo, useState } from 'react';

import { CheckBoxGroupContext } from './CheckBoxGroupContext';
import type { CheckBoxGroupContextValue } from './CheckBoxGroupContext';
import type { CheckBoxGroupProps } from './types';
import { FieldSet } from '../FieldSet';

/** Группа чекбоксов с общими состоянием и семантикой FieldSet. */
export const CheckBoxGroup = forwardRef<HTMLFieldSetElement, CheckBoxGroupProps>(
  (
    {
      children,
      value: controlledValue,
      defaultValue = [],
      onChange,
      dimension = 'm',
      disabled = false,
      readOnly = false,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue);
    const value = controlledValue === undefined ? uncontrolledValue : controlledValue;

    const handleChange = (event: React.SyntheticEvent<HTMLFieldSetElement>) => {
      if (readOnly) return;

      const input = event.target as HTMLInputElement;
      const nextValue = input.checked ? [...value, input.value] : value.filter((item) => item !== input.value);

      if (controlledValue === undefined) {
        setUncontrolledValue(nextValue);
      }
      onChange?.(nextValue);
    };

    const contextValue = useMemo<CheckBoxGroupContextValue>(
      () => ({ value, dimension, disabled, readOnly }),
      [value, dimension, disabled, readOnly],
    );

    return (
      <CheckBoxGroupContext.Provider value={contextValue}>
        <FieldSet
          ref={ref}
          aria-readonly={readOnly || undefined}
          dimension={dimension}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        >
          {children}
        </FieldSet>
      </CheckBoxGroupContext.Provider>
    );
  },
);

CheckBoxGroup.displayName = 'CheckBoxGroup';
