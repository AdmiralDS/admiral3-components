import { forwardRef, useMemo, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import { Badge, type BadgeAppearance } from '#src/components/Badge';
import { refSetter } from '#src/utils/refSetter';

import {
  ChipChildrenWrapperStyled,
  ChipComponentStyled,
  ChipContentWrapperStyled,
  CloseIconButton,
  IconWrapperStyled,
} from './style';
import type { ChipsProps } from './types';

export const Chips = forwardRef<HTMLDivElement, ChipsProps>(
  (
    {
      dimension = 'm',
      disabled,
      appearance = 'outlined',
      colorMode = 'colored',
      selected,
      onClose,
      children,
      iconStart,
      iconEnd,
      badge,
      readOnly,
      avatar,
      role,
      tabIndex,
      onKeyDown,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-pressed': ariaPressed,
      'aria-disabled': ariaDisabled,
      ...props
    },
    ref,
  ) => {
    const defaultChip = selected !== undefined;
    const withCloseIcon = !!onClose;
    const withBadge = !!badge;
    const actionable = !!props.onClick || selected !== undefined || (withCloseIcon && !readOnly);
    const accessibleProps = {
      role: role ?? (actionable ? 'button' : undefined),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-pressed': ariaPressed ?? (actionable ? selected : undefined),
      'aria-disabled': ariaDisabled ?? (disabled || (actionable && readOnly) || undefined),
    };

    const chipRef = useRef<HTMLDivElement | null>(null);
    const refItems = useRef<HTMLSpanElement | null>(null);

    const badgeAppearance: BadgeAppearance = useMemo(() => {
      if (selected && !disabled) return colorMode === 'neutral' ? 'neutral1' : 'whiteStatic';
      if (disabled) {
        if (selected) return 'neutral1Disable';
        return 'neutral2Disable';
      }
      if (colorMode === 'neutral') return 'neutral3';
      return 'info';
    }, [colorMode, selected, disabled]);

    const handleClickCloseIcon = (e: MouseEvent) => {
      e.stopPropagation();
      onClose?.(props.id);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (!disabled) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (withCloseIcon) {
            onClose?.();
          } else {
            //todo never or any
            props.onClick?.(e as never);
          }
        }
        onKeyDown?.(e);
      }
    };

    return (
      <>
        <ChipComponentStyled
          {...(!actionable ? accessibleProps : {})}
          {...props}
          onKeyDown={handleKeyDown}
          ref={refSetter(ref, chipRef)}
          $dimension={dimension}
          $disabled={disabled}
          $appearance={appearance}
          $colorMode={colorMode}
          $selected={selected}
          $defaultChip={defaultChip}
          $withCloseIcon={withCloseIcon}
          $readOnly={readOnly}
          $withBadge={withBadge}
          $clickable={!!props.onClick}
        >
          <ChipContentWrapperStyled
            {...(actionable ? accessibleProps : {})}
            tabIndex={actionable ? (disabled || readOnly ? -1 : (tabIndex ?? 0)) : undefined}
            $dimension={dimension}
            $disabled={disabled}
            $appearance={appearance}
            $colorMode={colorMode}
            $selected={selected}
            $withCloseIcon={readOnly || withCloseIcon}
          >
            {iconStart && (
              <IconWrapperStyled aria-hidden $dimension={dimension}>
                {iconStart}
              </IconWrapperStyled>
            )}
            {avatar && <IconWrapperStyled $dimension={dimension}>{avatar}</IconWrapperStyled>}
            <ChipChildrenWrapperStyled ref={refItems}>{children}</ChipChildrenWrapperStyled>
            {typeof badge !== 'undefined' && (
              <Badge data-badge dimension={'s'} appearance={badgeAppearance}>
                {badge}
              </Badge>
            )}
            {!withCloseIcon && iconEnd && (
              <IconWrapperStyled aria-hidden $dimension={dimension}>
                {iconEnd}
              </IconWrapperStyled>
            )}
          </ChipContentWrapperStyled>
          {!readOnly && withCloseIcon && (
            <CloseIconButton
              dimension={dimension === 'l' ? 'mBig' : dimension === 'm' ? 'sMedium' : 'sSmall'}
              disableHighlighter
              onClick={handleClickCloseIcon}
              disabled={disabled}
              tabIndex={-1}
              appearance={colorMode === 'colored' ? 'primary' : 'secondary'}
              $colorMode={colorMode}
            />
          )}
        </ChipComponentStyled>
      </>
    );
  },
);

Chips.displayName = 'Chips';
