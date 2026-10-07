import { forwardRef, useRef, type KeyboardEvent, type MouseEvent } from 'react';

import { refSetter } from '#src/utils/refSetter';

import { ChipContent } from './ChipContent';
import { CloseIcon, RemovableChipStyled } from './style';
import type { RemovableChipProps } from './types';
import { useChipTooltip } from './useChipTooltip';

export const RemovableChip = forwardRef<HTMLDivElement, RemovableChipProps>(
  (
    {
      children,
      dimension = 'm',
      appearance = 'outlined',
      colorMode = 'colored',
      iconsBefore,
      avatar,
      badge,
      disabled,
      readOnly,
      onClose,
      onKeyDown,
      tabIndex,
      renderContentTooltip,
      disabledTooltip,
      closeButtonProps,
      'aria-disabled': ariaDisabled,
      ...props
    },
    ref,
  ) => {
    const eventsDisabled = disabled || readOnly;

    const containerRef = useRef<HTMLDivElement | null>(null);

    const tooltip = useChipTooltip(containerRef, children, renderContentTooltip, disabledTooltip);

    const handleClickCloseIcon = (e: MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();

      if (!disabled) onClose?.();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      if (e.key === 'Backspace' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose?.();
      }

      onKeyDown?.(e);
    };

    return (
      <RemovableChipStyled
        {...props}
        ref={refSetter(containerRef, ref)}
        role="button"
        tabIndex={tabIndex ?? (disabled ? -1 : 0)}
        aria-disabled={ariaDisabled ?? (eventsDisabled || undefined)}
        onKeyDown={handleKeyDown}
        title={tooltip.title}
        $dimension={dimension}
        $appearance={appearance}
        $colorMode={colorMode}
        $disabled={disabled}
        $readOnly={readOnly}
      >
        <ChipContent
          children={children}
          iconsBefore={iconsBefore}
          avatar={avatar}
          badge={badge}
          dimension={dimension}
          colorMode={colorMode}
          disabled={disabled}
          contentRef={tooltip.contentRef}
        />
        {!readOnly && (
          <CloseIcon {...closeButtonProps} onClick={handleClickCloseIcon} $disabled={disabled} $colorMode={colorMode} />
        )}
      </RemovableChipStyled>
    );
  },
);

RemovableChip.displayName = 'RemovableChip';
