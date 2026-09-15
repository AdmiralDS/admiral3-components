import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { RadioGroupContext } from './RadioGroupContext';
import type { RadioGroupContextValue } from './RadioGroupContext';
import type { RadioGroupProps } from './types';
import { refSetter } from '../../utils/refSetter';
import { FieldSet } from '../FieldSet';

/**
 * Группа радиокнопок с общими состоянием, именем и семантикой FieldSet.
 * Каждый RadioButton в составе группы должен иметь явно заданный уникальный value.
 */
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

    const fieldSetRef = useRef<HTMLFieldSetElement | null>(null);
    const initialValueRef = useRef(defaultValue);

    const handleValueChange = useCallback(
      (nextValue: string) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(nextValue);
        }
        onChange?.(nextValue);
      },
      [controlledValue, onChange],
    );

    useEffect(() => {
      const form = fieldSetRef.current?.form;

      if (form && controlledValue === undefined) {
        const handleReset = () => setUncontrolledValue(initialValueRef.current);
        form.addEventListener('reset', handleReset);
        return () => form.removeEventListener('reset', handleReset);
      }
    }, [controlledValue]);

    const contextValue = useMemo<RadioGroupContextValue>(
      () => ({
        name,
        value,
        dimension,
        disabled,
        readOnly,
        required,
        onValueChange: handleValueChange,
      }),
      [name, value, dimension, disabled, readOnly, required, handleValueChange],
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <FieldSet
          ref={refSetter(fieldSetRef, ref)}
          aria-readonly={readOnly || undefined}
          dimension={dimension}
          disabled={disabled}
          required={required}
          {...props}
        >
          {children}
        </FieldSet>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
