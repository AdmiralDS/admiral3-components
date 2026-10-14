import { forwardRef, useRef } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, Text } from './style';
import { BadgeDot } from '../BadgeDot';
import type { TagProps } from './types';

export const TagDot = forwardRef<HTMLButtonElement, TagProps>(
  (
    { children, dimension = 'm', withBorder = false, iconsBefore, onClick, status = 'neutral', tabIndex, ...props },
    ref,
  ) => {
    const textRef = useRef<HTMLElement>(null);

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
          {...props}
        >
          <BadgeDot dimension={dimension === 'l' ? 'm' : 's'} appearance={badgeDotAppearance} />
          {children && (
            <Text $dimension={dimension} $colorText={customStatus ? status.textColor : undefined} ref={textRef}>
              {children}
            </Text>
          )}
        </Wrapper>
        {isVisible && <Tooltip {...tooltipProps}>{children}</Tooltip>}
      </>
    );
  },
);

TagDot.displayName = 'TagDot';
