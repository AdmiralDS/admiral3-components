import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CheckBoxGroupContext } from './CheckBoxGroupContext';
import type { CheckBoxGroupContextValue } from './CheckBoxGroupContext';
import type { CheckBoxGroupProps } from './types';
import { refSetter } from '../../utils/refSetter';
import { FieldSet } from '../FieldSet';

/**
 * Группа чекбоксов с общими состоянием и семантикой FieldSet.
 * Каждый CheckBox в составе группы должен иметь явно заданный уникальный value.
 */
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
    const fieldSetRef = useRef<HTMLFieldSetElement | null>(null);
    const initialValueRef = useRef(defaultValue);

    const handleItemChange = useCallback(
      (itemValue: string, checked: boolean) => {
        const nextValue = checked
          ? value.includes(itemValue)
            ? value
            : [...value, itemValue]
          : value.filter((item) => item !== itemValue);

        if (controlledValue === undefined) {
          setUncontrolledValue(nextValue);
        }
        onChange?.(nextValue);
      },
      [controlledValue, onChange, value],
    );

    useEffect(() => {
      const form = fieldSetRef.current?.form;

      if (form && controlledValue === undefined) {
        const handleReset = () => setUncontrolledValue([...initialValueRef.current]);
        form.addEventListener('reset', handleReset);
        return () => form.removeEventListener('reset', handleReset);
      }
    }, [controlledValue]);

    const contextValue = useMemo<CheckBoxGroupContextValue>(
      () => ({ value, dimension, disabled, readOnly, onItemChange: handleItemChange }),
      [value, dimension, disabled, readOnly, handleItemChange],
    );

    return (
      <CheckBoxGroupContext.Provider value={contextValue}>
        <FieldSet
          ref={refSetter(fieldSetRef, ref)}
          aria-readonly={readOnly || undefined}
          dimension={dimension}
          disabled={disabled}
          {...props}
        >
          {children}
        </FieldSet>
      </CheckBoxGroupContext.Provider>
    );
  },
);

CheckBoxGroup.displayName = 'CheckBoxGroup';
