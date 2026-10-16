import { forwardRef, useRef, useState, type MouseEvent } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { isOverflowed } from '#src/utils/isOverflowed';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, Text, StatusDot } from './style';
import type { TagDotProps } from './types';

export const TagDot = forwardRef<HTMLButtonElement, TagDotProps>(
  (
    { children, dimension = 'm', withBorder = false, onClick, status = 'neutral', tabIndex, onMouseEnter, ...props },
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
    const badgeDotAppearance = customStatus
      ? status.dotColor !== undefined
        ? { backgroundColor: status.dotColor }
        : 'neutral'
      : status;

    return (
      <>
        <Wrapper
          {...targetProps}
          ref={refSetter(ref, targetRef)}
          onClick={onClick}
          $clickable={active}
          $withBorder={withBorder}
          $dimension={dimension}
          $status={customStatus ? status : 'neutral'}
          tabIndex={tabIndex ?? (active ? 0 : -1)}
          type="button"
          onMouseEnter={handleMouseEnter}
          {...props}
        >
          <StatusDot dimension={dimension === 'l' ? 'm' : 's'} appearance={badgeDotAppearance} />
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

TagDot.displayName = 'TagDot';
