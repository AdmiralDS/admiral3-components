import { forwardRef, useContext } from 'react';

import { RadioGroupContext } from './RadioGroupContext';
import { Control, StyledRadioButton } from './style';
import type { RadioButtonProps } from './types';
import { NativeInput, SelectionControlExtraText, SelectionControlLabelContent } from '../_internal/InputAtoms';

const DEFAULT_DIMENSION = 'm';

/** Радиальные кнопки применяются, когда есть список опций, из которых пользователь может выбрать только один вариант. */
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      name: nameProp,
      value,
      checked: checkedProp,
      defaultChecked: defaultCheckedProp,
      dimension: dimensionProp = DEFAULT_DIMENSION,
      required: requiredProp = false,
      disabled: disabledProp = false,
      error = false,
      children,
      extraText,
      className,
      style,
      onChange,
      onClick,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const group = useContext(RadioGroupContext);
    /** При наличии RadioGroup настройки группы имеют приоритет в сравнении
     * с индивидуальными настройками RadioButton */
    const dimension = group?.dimension ?? dimensionProp;
    const disabled = Boolean(group?.disabled || disabledProp);
    const readOnly = Boolean(group?.readOnly);
    const required = Boolean(group?.required || requiredProp);
    const name = group?.name ?? nameProp;
    const checked = group ? group.value === String(value) : checkedProp;
    const defaultChecked = group ? undefined : defaultCheckedProp;

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      if (readOnly) {
        // Нативный readonly не поддерживается radio кнопками. Отменяем click, который браузер создаёт
        // при активации мышью, Space или стрелками, чтобы сохранить текущее checked-состояние кнопки.
        event.preventDefault();
      }

      onClick?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // React может вызвать onChange при клавиатурной активации даже после отменённого click.
      // Не выпускаем такое событие наружу, иначе пользователь через controlled state сможет изменить readonly-значение.
      if (!readOnly) {
        onChange?.(event);
        group?.onValueChange(event.currentTarget.value);
      }
    };

    return (
      <StyledRadioButton
        className={className}
        style={style}
        $dimension={dimension}
        $disabled={disabled}
        $readOnly={readOnly}
        data-dimension={dimension}
      >
        <NativeInput
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-readonly={readOnly || undefined}
          aria-invalid={error || ariaInvalid || undefined}
          onChange={handleChange}
          onClick={handleClick}
          {...props}
        />
        <Control $error={error} aria-hidden="true" />
        {children != null && (
          <SelectionControlLabelContent $hasExtraText={extraText != null} data-dimension={dimension}>
            {children}
            {extraText != null && (
              <SelectionControlExtraText $disabled={disabled}>{extraText}</SelectionControlExtraText>
            )}
          </SelectionControlLabelContent>
        )}
      </StyledRadioButton>
    );
  },
);

RadioButton.displayName = 'RadioButton';
