import { forwardRef, useMemo, type KeyboardEvent, type MouseEvent } from 'react';

import type { BadgeAppearance } from '#src/components/Badge';

import { SelectableChipStyled } from './style';
import type { SelectableChipProps } from './types';

/**
 * Не является контрактным компонентом дизайн-системы.
 * Может использоваться самостоятельно или как часть более сложных компонентов, включая FilterChips.
 */
export const SelectableChip = forwardRef<HTMLDivElement, SelectableChipProps>(
  (
    {
      selected = false,
      disabled,
      readOnly,
      onClick,
      onKeyDown,
      onSelectedChange,
      badgeAppearance,
      appearance = 'outlined',
      colorMode = 'colored',
      ...props
    },
    ref,
  ) => {
    const eventsDisabled = disabled || readOnly;

    const presetBadgeAppearance: BadgeAppearance | undefined = useMemo(() => {
      if (badgeAppearance) return badgeAppearance;

      if (selected) {
        if (disabled) return 'neutral1Disable';
        else return colorMode === 'neutral' ? 'neutral1' : 'whiteStatic';
      }
    }, [colorMode, selected, disabled, badgeAppearance]);

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
      <SelectableChipStyled
        {...props}
        ref={ref}
        role="button"
        aria-pressed={selected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        $selected={selected}
        disabled={disabled}
        readOnly={readOnly}
        badgeAppearance={presetBadgeAppearance}
        appearance={appearance}
        colorMode={colorMode}
      />
    );
  },
);

SelectableChip.displayName = 'SelectableChip';
