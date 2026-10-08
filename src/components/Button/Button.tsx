import { forwardRef, Children, useContext, useState } from 'react';

import { ButtonGroupContext } from '#src/components/ButtonGroup/ButtonGroupContext';
import { SpinnerIcon } from '#src/components/Spinner/SpinnerIcon';

import { StyledButton, ButtonContent, SpinnerContainer } from './style';
import type { ButtonProps } from './types';

const DEFAULT_APPEARANCE = 'solid';
const DEFAULT_COLOR_MODE = 'colored';

/** Кнопки представлены в четырех размерностях L, M, S и XS.
 * Для дополнительных акцентов и более прозрачных действий могут применяться кнопки
 * с иконками и текстом. Иконка может быть как перед надписью, так и после. В некоторых
 * случаях могут использоваться кнопки только с иконками. Как правило, это иконки,
 * значения которых общепонятны и не вызывают сомнений.
 *
 * ВАЖНО: кнопки с appearance='solid' и appearance='ghost' могут применяться только
 * в сочетании с colorMode='colored' или colorMode='neutral' */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      dimension: userDimension,
      appearance: userAppearance,
      colorMode: userColorModeProp,
      colorConfig,
      disabled,
      inactive = false,
      square = false,
      loading = false,
      loadingPosition,
      skeleton = false,
      onClick,
      onBlur,
      onKeyDown,
      onKeyUp,
      children,
      ...props
    },
    ref,
  ) => {
    const buttonGroup = useContext(ButtonGroupContext);
    const dimension = buttonGroup?.dimension ?? userDimension ?? 'm';
    const appearance = buttonGroup?.appearance ?? userAppearance ?? DEFAULT_APPEARANCE;
    const userColorMode = buttonGroup?.colorMode ?? userColorModeProp ?? DEFAULT_COLOR_MODE;
    const resolvedColorConfig = buttonGroup ? buttonGroup.colorConfig : colorConfig;
    const [enterPressed, setEnterPressed] = useState(false);

    /** Использование fallback-значения при невалидной комбинации пропсов */
    const colorMode =
      (appearance === 'solid' || appearance === 'ghost') && userColorMode === 'staticWhite'
        ? DEFAULT_COLOR_MODE
        : userColorMode;

    const spinnerApperance =
      appearance === 'solid' ? (colorMode === 'colored' ? 'staticWhite' : 'inverted') : colorMode;
    const spinnerDimension = dimension === 'l' ? 'm' : dimension;

    const hasAccessibleName = props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined;
    const ariaLabel = hasAccessibleName || !loading ? undefined : 'Загрузка...';
    const ariaDisabled = inactive || loading ? 'true' : undefined;
    const ariaHidden = skeleton ? true : undefined;
    const tabIndex = disabled || skeleton ? -1 : 0;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || skeleton) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);

      if (event.key === 'Enter') setEnterPressed(true);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyUp?.(event);

      if (event.key === 'Enter') setEnterPressed(false);
    };

    const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
      onBlur?.(event);
      setEnterPressed(false);
    };

    return (
      <StyledButton
        ref={ref}
        type={type}
        disabled={disabled}
        $dimension={dimension}
        $appearance={appearance}
        $buttonGroup={buttonGroup !== null}
        $colorConfig={resolvedColorConfig}
        $colorMode={colorMode}
        $loading={loading}
        $loadingPosition={loadingPosition}
        $skeleton={skeleton}
        $inactive={inactive}
        $square={square}
        aria-label={ariaLabel}
        aria-disabled={ariaDisabled}
        aria-hidden={ariaHidden}
        tabIndex={tabIndex}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        {...props}
        data-button-skeleton={skeleton ? '' : undefined}
        data-button-pressed={enterPressed ? '' : undefined}
      >
        {loading && !loadingPosition && (
          <SpinnerContainer>
            <SpinnerIcon appearance={spinnerApperance} dimension={spinnerDimension} />
          </SpinnerContainer>
        )}
        <ButtonContent $dimension={dimension}>
          {loading && loadingPosition === 'start' && (
            <SpinnerIcon appearance={spinnerApperance} dimension={spinnerDimension} />
          )}
          {Children.toArray(children).map((child, index) =>
            typeof child === 'string' ? <span key={child + index}>{child}</span> : child,
          )}
          {loading && loadingPosition === 'end' && (
            <SpinnerIcon appearance={spinnerApperance} dimension={spinnerDimension} />
          )}
        </ButtonContent>
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';
