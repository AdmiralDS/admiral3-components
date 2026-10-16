import { forwardRef, useRef, useState, type MouseEvent } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { hasSlotContent } from '#src/utils/hasSlotContent';
import { isOverflowed } from '#src/utils/isOverflowed';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, IconsWrapper, Text } from './style';
import type { TagTintedProps } from './types';

export const TagTinted = forwardRef<HTMLButtonElement, TagTintedProps>(
  (
    {
      children,
      dimension = 'm',
      withBorder = false,
      iconsBefore,
      onClick,
      status = 'neutral',
      tabIndex,
      onMouseEnter,
      ...props
    },
    ref,
  ) => {
    const textRef = useRef<HTMLElement>(null);
    const [textOverflow, setTextOverflow] = useState<boolean>(false);

    const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
      onMouseEnter?.(event);

      if (isOverflowed(textRef.current)) {
        setTextOverflow(true);
      } else {
        setTextOverflow(false);
      }
    };

    const {
      targetProps: { ref: targetRef, ...targetProps },
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLButtonElement>();

    const active = !!onClick;
    const customStatus = typeof status === `object`;

    return (
      <>
        <Wrapper
          {...targetProps}
          ref={refSetter(ref, targetRef)}
          onClick={onClick}
          $clickable={active}
          $status={status}
          $dimension={dimension}
          $withBorder={withBorder}
          tabIndex={tabIndex ?? (active ? 0 : -1)}
          type="button"
          onMouseEnter={handleMouseEnter}
          {...props}
        >
          {hasSlotContent(iconsBefore) && <IconsWrapper $dimension={dimension}>{iconsBefore}</IconsWrapper>}
          {children && (
            <Text $dimension={dimension} $colorText={customStatus ? status.textColor : undefined} ref={textRef}>
              {children}
            </Text>
          )}
        </Wrapper>
        {isVisible && textOverflow && <Tooltip {...tooltipProps}>{children}</Tooltip>}
      </>
    );
  },
);

TagTinted.displayName = 'TagTinted';
