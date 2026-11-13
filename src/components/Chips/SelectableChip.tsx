import { forwardRef, useMemo, type KeyboardEvent, type MouseEvent } from 'react';

import { Tooltip } from '#src/components/Tooltip';
import { hasSlotContent } from '#src/utils/hasSlotContent';
import { refSetter } from '#src/utils/refSetter';

import { ChipContent } from './ChipContent';
import { IconsWrapperStyled, SelectableChipStyled } from './style';
import type { SelectableChipProps } from './types';
import { useChipTooltip } from './useChipTooltip';

export const SelectableChip = forwardRef<HTMLDivElement, SelectableChipProps>(
  (
    {
      children,
      dimension = 'm',
      appearance = 'outlined',
      colorMode = 'colored',
      iconsBefore,
      avatar,
      badge,
      selected = false,
      disabled,
      readOnly,
      renderTooltipContent,
      showTooltip = true,
      onClick,
      onKeyDown,
      onSelectedChange,
      tabIndex,
      iconsAfter,
      'aria-disabled': ariaDisabled,
      ...domProps
    },
    ref,
  ) => {
    const eventsDisabled = disabled || readOnly;

    const { triggerRef, contentRef, isTooltipVisible, tooltipProps } = useChipTooltip(showTooltip);
    const chipRef = useMemo(() => refSetter(ref, triggerRef), [ref, triggerRef]);
    const tooltipContent = renderTooltipContent ? renderTooltipContent() : children;
    const shouldShowTooltip = isTooltipVisible && hasSlotContent(tooltipContent);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      onKeyDown?.(e);

      if ((e.key === 'Enter' || e.key === ' ') && !e.defaultPrevented) {
        e.preventDefault();
        e.currentTarget.click();
      }
    };

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      onSelectedChange?.(!selected);
      onClick?.(e);
    };

    return (
      <>
        <SelectableChipStyled
          {...domProps}
          ref={chipRef}
          role="button"
          tabIndex={tabIndex ?? (disabled ? -1 : 0)}
          aria-disabled={ariaDisabled ?? (eventsDisabled || undefined)}
          aria-pressed={selected}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          $dimension={dimension}
          $appearance={appearance}
          $colorMode={colorMode}
          $selected={selected}
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
            selected={selected}
            disabled={disabled}
            contentRef={contentRef}
          />
          {hasSlotContent(iconsAfter) && (
            <IconsWrapperStyled aria-hidden $dimension={dimension}>
              {iconsAfter}
            </IconsWrapperStyled>
          )}
        </SelectableChipStyled>
        {shouldShowTooltip && <Tooltip {...tooltipProps}>{tooltipContent}</Tooltip>}
      </>
    );
  },
);

SelectableChip.displayName = 'SelectableChip';
