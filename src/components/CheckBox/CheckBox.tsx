import { forwardRef, useContext, useLayoutEffect, useRef } from 'react';

// Иконки отличаются от стандартных из пакета по path
// поэтому для этого компонента выгружены отдельно по размерам
import MinusMIcon from './assets/Minus_M.svg?react';
import MinusSIcon from './assets/Minus_S.svg?react';
import MinusXsIcon from './assets/Minus_XS.svg?react';
import SuccessMIcon from './assets/Success_M.svg?react';
import SuccessSIcon from './assets/Success_S.svg?react';
import SuccessXsIcon from './assets/Success_XS.svg?react';
import { CheckBoxGroupContext } from './CheckBoxGroupContext';
import { Control, StyledCheckBox } from './style';
import type { CheckBoxProps } from './types';
import { refSetter } from '../../utils/refSetter';
import { NativeInput, SelectionControlExtraText, SelectionControlLabelContent } from '../_internal/InputAtoms';

const SUCCESS_ICONS = {
  m: SuccessMIcon,
  s: SuccessSIcon,
  xs: SuccessXsIcon,
};

const MINUS_ICONS = {
  m: MinusMIcon,
  s: MinusSIcon,
  xs: MinusXsIcon,
};

/** Поле выбора с поддержкой checked, indeterminate, disabled, readOnly и error состояний. */
export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  (
    {
      value,
      checked: checkedProp,
      defaultChecked: defaultCheckedProp,
      dimension: dimensionProp = 'm',
      indeterminate = false,
      error = false,
      readOnly: readOnlyProp = false,
      children,
      extraText,
      disabled: disabledProp = false,
      className,
      style,
      onChange,
      onClick,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const group = useContext(CheckBoxGroupContext);
    /** При наличии CheckBoxGroup настройки группы имеют приоритет в сравнении
     * с индивидуальными настройками CheckBox. */
    const dimension = group?.dimension ?? dimensionProp;
    const disabled = Boolean(group?.disabled || disabledProp);
    const readOnly = Boolean(group?.readOnly || readOnlyProp);
    const checked = group ? group.value.includes(String(value)) : checkedProp;
    const defaultChecked = group ? undefined : defaultCheckedProp;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const StateIcon = indeterminate ? MINUS_ICONS[dimension] : SUCCESS_ICONS[dimension];

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      if (readOnly) {
        event.preventDefault();
      }

      onClick?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!readOnly) {
        onChange?.(event);
        group?.onItemChange(event.currentTarget.value, event.currentTarget.checked);
      }

      event.currentTarget.indeterminate = indeterminate;
    };

    useLayoutEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    });

    return (
      <StyledCheckBox
        $dimension={dimension}
        $disabled={disabled}
        $readOnly={readOnly}
        className={className}
        style={style}
      >
        <NativeInput
          ref={refSetter(inputRef, ref)}
          type="checkbox"
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          readOnly={readOnly}
          aria-readonly={readOnly || undefined}
          data-read-only={readOnly ? '' : undefined}
          aria-invalid={error || ariaInvalid || undefined}
          aria-checked={indeterminate ? 'mixed' : undefined}
          onChange={handleChange}
          onClick={handleClick}
          {...props}
        />
        <Control $error={error} aria-hidden="true">
          <StateIcon data-icon={indeterminate ? 'minus' : 'success'} />
        </Control>
        {children != null && (
          <SelectionControlLabelContent $hasExtraText={extraText != null} data-dimension={dimension}>
            {children}
            {extraText != null && (
              <SelectionControlExtraText $disabled={disabled}>{extraText}</SelectionControlExtraText>
            )}
          </SelectionControlLabelContent>
        )}
      </StyledCheckBox>
    );
  },
);

CheckBox.displayName = 'CheckBox';
