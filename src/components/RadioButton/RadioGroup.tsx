import { forwardRef, useId, useMemo, useState } from 'react';

import { RadioGroupContext } from './RadioGroupContext';
import type { RadioGroupContextValue } from './RadioGroupContext';
import type { RadioGroupProps } from './types';
import { FieldSet } from '../FieldSet';

/** Группа радиокнопок с общими состоянием, именем и семантикой FieldSet. */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      children,
      name: nameProp,
      value: controlledValue,
      defaultValue,
      onChange,
      dimension = 'm',
      disabled = false,
      readOnly = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    const generatedName = useId();
    const name = nameProp ?? `radio-group-${generatedName}`;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = controlledValue === undefined ? uncontrolledValue : controlledValue;

    const handleChange = (event: React.SyntheticEvent<HTMLFieldSetElement>) => {
      if (readOnly) return;
      const nextValue = (event.target as HTMLInputElement).value;

      if (controlledValue === undefined) {
        setUncontrolledValue(nextValue);
      }
      onChange?.(nextValue);
    };

    const contextValue = useMemo<RadioGroupContextValue>(
      () => ({
        name,
        value,
        dimension,
        disabled,
        readOnly,
        required,
      }),
      [name, value, dimension, disabled, readOnly, required],
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <FieldSet
          ref={ref}
          aria-readonly={readOnly || undefined}
          dimension={dimension}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          {...props}
        >
          {children}
        </FieldSet>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
