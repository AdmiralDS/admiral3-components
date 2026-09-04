import { forwardRef } from 'react';

import { ServiceEyeCloseOutline, ServiceEyeOutline } from '@admiral-ds/admiral3-icons';

import type { InputIconButtonProps } from '../_internal/InputAtoms';
import { InputIconButton } from '../_internal/InputAtoms';

export interface InputIconPasswordButtonProps extends InputIconButtonProps {
  /** Показывается ли пароль открытым текстом. */
  visible: boolean;
  /** Вызывается с новым значением видимости при нажатии на кнопку. */
  onVisibleChange: (visible: boolean) => void;
  /** Доступное имя кнопки для скрытого пароля. */
  showPasswordAriaLabel?: string;
  /** Доступное имя кнопки для видимого пароля. */
  hidePasswordAriaLabel?: string;
}

/** Кнопка показа и скрытия пароля для размещения в `Input.iconsAfter`. */
export const InputIconPasswordButton = forwardRef<HTMLButtonElement, InputIconPasswordButtonProps>(
  (
    {
      visible,
      onVisibleChange,
      showPasswordAriaLabel = 'Показать пароль',
      hidePasswordAriaLabel = 'Скрыть пароль',
      children,
      preventFocus = true,
      onClick,
      'aria-label': ariaLabel,
      'aria-pressed': ariaPressed,
      ...props
    },
    ref,
  ) => {
    const handleClick: InputIconButtonProps['onClick'] = (event) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        onVisibleChange(!visible);
      }
    };

    return (
      <InputIconButton
        ref={ref}
        aria-label={ariaLabel ?? (visible ? hidePasswordAriaLabel : showPasswordAriaLabel)}
        aria-pressed={ariaPressed ?? visible}
        preventFocus={preventFocus}
        onClick={handleClick}
        {...props}
      >
        {children ?? (visible ? <ServiceEyeOutline aria-hidden /> : <ServiceEyeCloseOutline aria-hidden />)}
      </InputIconButton>
    );
  },
);

InputIconPasswordButton.displayName = 'InputIconPasswordButton';
