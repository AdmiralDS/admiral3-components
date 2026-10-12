import { forwardRef, useRef, type KeyboardEvent, type MouseEvent } from 'react';

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
      renderContentTooltip,
      disabledTooltip,
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

    const containerRef = useRef<HTMLDivElement | null>(null);

    const tooltip = useChipTooltip(containerRef, children, renderContentTooltip, disabledTooltip);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.click();
      }

      onKeyDown?.(e);
    };

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      onSelectedChange?.(!selected);
      onClick?.(e);
    };

    return (
      <SelectableChipStyled
        {...domProps}
        ref={refSetter(containerRef, ref)}
        role="button"
        tabIndex={tabIndex ?? (disabled ? -1 : 0)}
        aria-disabled={ariaDisabled ?? (eventsDisabled || undefined)}
        aria-pressed={selected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={tooltip.title}
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
          contentRef={tooltip.contentRef}
        />
        {hasSlotContent(iconsAfter) && (
          <IconsWrapperStyled aria-hidden $dimension={dimension}>
            {iconsAfter}
          </IconsWrapperStyled>
        )}
      </SelectableChipStyled>
    );
  },
);

SelectableChip.displayName = 'SelectableChip';
