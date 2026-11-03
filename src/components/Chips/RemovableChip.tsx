import { forwardRef, useMemo, type KeyboardEvent, type MouseEvent } from 'react';

import { Tooltip } from '#src/components/Tooltip';
import { hasSlotContent } from '#src/utils/hasSlotContent';
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
      onClick,
      onKeyDown,
      tabIndex,
      renderTooltipContent,
      showTooltip = true,
      closeButtonProps,
      'aria-disabled': ariaDisabled,
      ...props
    },
    ref,
  ) => {
    const eventsDisabled = disabled || readOnly;

    const { triggerRef, contentRef, isTooltipVisible, tooltipProps } = useChipTooltip(showTooltip);
    const chipRef = useMemo(() => refSetter(ref, triggerRef), [ref, triggerRef]);
    const tooltipContent = renderTooltipContent ? renderTooltipContent() : children;
    const shouldShowTooltip = isTooltipVisible && hasSlotContent(tooltipContent);

    const handleClickCloseIcon = (e: MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();

      if (!disabled) onClose?.();
    };

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      onClick?.(e);
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
      <>
        <RemovableChipStyled
          {...props}
          ref={chipRef}
          role="button"
          tabIndex={tabIndex ?? (disabled ? -1 : 0)}
          aria-disabled={ariaDisabled ?? (eventsDisabled || undefined)}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
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
            contentRef={contentRef}
          />
          {!readOnly && (
            <CloseIcon
              {...closeButtonProps}
              onClick={handleClickCloseIcon}
              $disabled={disabled}
              $colorMode={colorMode}
            />
          )}
        </RemovableChipStyled>
        {shouldShowTooltip && <Tooltip {...tooltipProps}>{tooltipContent}</Tooltip>}
      </>
    );
  },
);

RemovableChip.displayName = 'RemovableChip';
