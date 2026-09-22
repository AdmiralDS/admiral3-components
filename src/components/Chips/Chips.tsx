import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import { Badge, type BadgeAppearance } from '#src/components/Badge';
import { checkOverflow } from '#src/utils/checkOverflow';
import { hasSlotContent } from '#src/utils/hasSlotContent';
import { refSetter } from '#src/utils/refSetter';

import {
  ChipChildrenWrapperStyled,
  ChipComponentStyled,
  ChipContentWrapperStyled,
  CloseIconButton,
  IconsWrapperStyled,
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
      iconsBefore,
      avatar,
      badge,
      readOnly,
      role,
      tabIndex,
      onKeyDown,
      closeButtonProps,
      renderContentTooltip,
      disabledTooltip,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-pressed': ariaPressed,
      'aria-disabled': ariaDisabled,
      ...props
    },
    ref,
  ) => {
    const withCloseIcon = !!onClose;
    const innerSelected = withCloseIcon ? undefined : selected;
    const eventsDisabled = disabled || readOnly;
    const domProps = eventsDisabled
      ? Object.fromEntries(Object.entries(props).filter(([name]) => !/^on[A-Z]/.test(name)))
      : props;
    const defaultChip = innerSelected !== undefined;
    const withBadge = !!badge;
    const actionable = !!props.onClick || defaultChip || (withCloseIcon && !readOnly);
    const accessibleProps = {
      role: role ?? (actionable ? 'button' : undefined),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-pressed': ariaPressed ?? (actionable ? innerSelected : undefined),
      'aria-disabled': ariaDisabled ?? (disabled || (actionable && readOnly) || undefined),
    };

    const [overflow, setOverflow] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    //TODO добавить проверку на number при добавлении компонента Tooltip
    const childrenIsPrimitive = typeof children === 'string';

    const chipRef = useRef<HTMLDivElement | null>(null);
    const refItems = useRef<HTMLSpanElement | null>(null);

    const badgeAppearance: BadgeAppearance = useMemo(() => {
      if (innerSelected && !disabled) return colorMode === 'neutral' ? 'neutral1' : 'whiteStatic';
      if (disabled) {
        if (innerSelected) return 'neutral1Disable';
        return 'neutral2Disable';
      }
      if (colorMode === 'neutral') return 'neutral3';
      return 'info';
    }, [colorMode, innerSelected, disabled]);

    const handleClickCloseIcon = (e: MouseEvent) => {
      e.stopPropagation();
      if (eventsDisabled) return;
      onClose?.();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (!eventsDisabled) {
        if (e.key === 'Backspace' && withCloseIcon) {
          e.preventDefault();
          onClose?.();
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();

          if (withCloseIcon) {
            onClose?.();
          } else {
            //eslint-disable-next-line
            props.onClick?.(e as any);
          }
        }
        onKeyDown?.(e);
      }
    };

    useEffect(() => {
      if (disabledTooltip) return;

      if (refItems.current && checkOverflow(refItems.current) !== overflow) {
        setOverflow(checkOverflow(refItems.current));
      }
    }, [tooltipVisible, overflow, setOverflow, disabledTooltip]);

    useLayoutEffect(() => {
      if (disabledTooltip) return;

      function show() {
        setTooltipVisible(true);
      }
      function hide() {
        setTooltipVisible(false);
      }

      const chip = chipRef.current;

      if (chip) {
        chip.addEventListener('mouseenter', show);
        chip.addEventListener('mouseleave', hide);
        chip.addEventListener('focus', show);
        chip.addEventListener('blur', hide);
        return () => {
          chip.removeEventListener('mouseenter', show);
          chip.removeEventListener('mouseleave', hide);
          chip.removeEventListener('focus', show);
          chip.removeEventListener('blur', hide);
        };
      }
    }, [setTooltipVisible, disabledTooltip]);

    const hasTooltipContent = renderContentTooltip || (childrenIsPrimitive && children);
    const shouldRenderTooltip = !disabledTooltip && tooltipVisible && overflow && !!hasTooltipContent;
    //TODO переделать проверку на рендер контента при добавлении компонента Tooltip
    const tooltipContent = renderContentTooltip?.();
    const tooltipRenderContent = tooltipContent ? tooltipContent : childrenIsPrimitive ? children : undefined;

    return (
      <>
        <ChipComponentStyled
          {...(!actionable ? accessibleProps : {})}
          {...domProps}
          onKeyDown={handleKeyDown}
          ref={refSetter(ref, chipRef)}
          $dimension={dimension}
          $disabled={disabled}
          $appearance={appearance}
          $colorMode={colorMode}
          $selected={innerSelected}
          $defaultChip={defaultChip}
          $withCloseIcon={withCloseIcon}
          $readOnly={readOnly}
          $withBadge={withBadge}
          $clickable={!!props.onClick}
          $withTooltip={overflow}
          title={shouldRenderTooltip ? tooltipRenderContent : undefined}
        >
          <ChipContentWrapperStyled
            {...(actionable ? accessibleProps : {})}
            tabIndex={tabIndex ?? (disabled ? -1 : 0)}
            $dimension={dimension}
            $disabled={disabled}
            $appearance={appearance}
            $colorMode={colorMode}
            $selected={innerSelected}
            $withCloseIcon={readOnly || withCloseIcon}
          >
            {hasSlotContent(iconsBefore) && (
              <IconsWrapperStyled aria-hidden $dimension={dimension}>
                {iconsBefore}
              </IconsWrapperStyled>
            )}
            {hasSlotContent(avatar) && <IconsWrapperStyled $dimension={dimension}>{avatar}</IconsWrapperStyled>}
            <ChipChildrenWrapperStyled ref={refItems}>{children}</ChipChildrenWrapperStyled>
            {typeof badge !== 'undefined' && (
              <Badge data-badge dimension={'s'} appearance={badgeAppearance}>
                {badge}
              </Badge>
            )}
          </ChipContentWrapperStyled>
          {!readOnly && withCloseIcon && (
            <CloseIconButton
              {...closeButtonProps}
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
