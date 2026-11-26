import { forwardRef, isValidElement, useMemo, useState, type MouseEvent } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { useOverflow } from '#src/hooks/useOverflow';
import { hasSlotContent } from '#src/utils/hasSlotContent';
import { refSetter } from '#src/utils/refSetter';

import { CloseIcon } from './RemovableChip/style';
import { ChipChildrenWrapperStyled, ChipStyled, IconsWrapperStyled } from './style';
import type { ChipBaseProps } from './types';
import { Badge, type BadgeAppearance } from '../Badge';

export const Chip = forwardRef<HTMLDivElement, ChipBaseProps>(
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
      renderTooltipContent,
      showTooltip = true,
      onClick,
      tabIndex,
      iconsAfter,
      'aria-disabled': ariaDisabled,
      badgeAppearance,
      ...props
    },
    ref,
  ) => {
    const eventsDisabled = disabled || readOnly;

    const [contentElement, setContentElement] = useState<HTMLSpanElement | null>(null);
    const {
      triggerProps: { ref: triggerRef },
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLDivElement>();
    const textOverflow = useOverflow(tooltipProps.targetElement, contentElement);

    const presetBadgeAppearance: BadgeAppearance = useMemo(() => {
      if (badgeAppearance) return badgeAppearance;

      if (disabled) {
        return 'neutral2Disable';
      }
      if (colorMode === 'neutral') return 'neutral3';
      return 'info';
    }, [colorMode, disabled, badgeAppearance]);

    const chipRef = useMemo(() => refSetter(ref, showTooltip ? triggerRef : undefined), [ref, showTooltip, triggerRef]);
    const tooltipContent = renderTooltipContent ? renderTooltipContent() : children;
    const shouldShowTooltip = isVisible && hasSlotContent(tooltipContent) && textOverflow && showTooltip;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (eventsDisabled) return;

      onClick?.(e);
    };
    const isCloseIcon = isValidElement(iconsAfter) && iconsAfter.type === CloseIcon;

    return (
      <>
        <ChipStyled
          {...props}
          ref={chipRef}
          tabIndex={tabIndex ?? (disabled ? -1 : 0)}
          aria-disabled={ariaDisabled ?? (eventsDisabled || undefined)}
          onClick={handleClick}
          $dimension={dimension}
          $appearance={appearance}
          $colorMode={colorMode}
          $disabled={disabled}
          $readOnly={readOnly}
        >
          {hasSlotContent(iconsBefore) && (
            <IconsWrapperStyled aria-hidden $dimension={dimension}>
              {iconsBefore}
            </IconsWrapperStyled>
          )}
          {hasSlotContent(avatar) && <IconsWrapperStyled $dimension={dimension}>{avatar}</IconsWrapperStyled>}
          <ChipChildrenWrapperStyled ref={setContentElement}>{children}</ChipChildrenWrapperStyled>
          {badge !== undefined && (
            <Badge data-badge dimension="s" appearance={presetBadgeAppearance}>
              {badge}
            </Badge>
          )}
          {hasSlotContent(iconsAfter) && (
            <IconsWrapperStyled aria-hidden={isCloseIcon ? undefined : true} $dimension={dimension}>
              {iconsAfter}
            </IconsWrapperStyled>
          )}
        </ChipStyled>
        {shouldShowTooltip && <Tooltip {...tooltipProps}>{tooltipContent}</Tooltip>}
      </>
    );
  },
);

Chip.displayName = 'Chip';
