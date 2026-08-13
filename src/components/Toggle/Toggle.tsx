import { forwardRef } from 'react';

import { TOGGLE_ROOT_DATA_ATTRIBUTE } from './constants';
import { Control, LabelContent, StyledToggle, Thumb } from './style';
import type { ToggleProps } from './types';
import { NativeInput, SelectionControlExtraText } from '../_internal/InputAtoms';

/** Переключатель между двумя равнозначными состояниями интерфейса. */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      dimension = 'm',
      disabled = false,
      readOnly = false,
      labelPosition = 'right',
      width,
      children,
      extraText,
      className,
      style,
      onChange,
      onClick,
      ...props
    },
    ref,
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      if (readOnly) event.preventDefault();
      onClick?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!readOnly) onChange?.(event);
    };

    return (
      <StyledToggle
        {...{ [TOGGLE_ROOT_DATA_ATTRIBUTE]: 'true' }}
        className={className}
        style={style}
        $dimension={dimension}
        $disabled={disabled}
        $readOnly={readOnly}
        $labelPosition={labelPosition}
        $width={width}
        data-dimension={dimension}
      >
        <NativeInput
          ref={ref}
          type="checkbox"
          role="switch"
          disabled={disabled}
          readOnly={readOnly}
          aria-readonly={readOnly || undefined}
          onChange={handleChange}
          onClick={handleClick}
          {...props}
        />
        <Control aria-hidden="true">
          <Thumb />
        </Control>
        {children != null && (
          <LabelContent $hasExtraText={extraText != null} data-dimension={dimension}>
            {children}
            {extraText != null && (
              <SelectionControlExtraText $disabled={disabled}>{extraText}</SelectionControlExtraText>
            )}
          </LabelContent>
        )}
      </StyledToggle>
    );
  },
);

Toggle.displayName = 'Toggle';
