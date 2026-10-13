import { forwardRef, useRef } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, Text } from './style';
import { BadgeDot } from '../BadgeDot';
import type { TagNeutralProps, TagStatus } from './types';

export const TagDot = forwardRef<HTMLButtonElement, TagNeutralProps>(
  ({ children, dimension = 'm', withBorder = false, iconsBefore, onClick, status, ...props }, ref) => {
    const textRef = useRef<HTMLElement>(null);

    const {
      targetProps: { ref: targetRef, ...targetProps },
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLButtonElement>();

    return (
      <>
        <Wrapper
          {...targetProps}
          ref={refSetter(ref, targetRef)}
          onClick={onClick}
          $clickable={!!onClick}
          $withBorder={withBorder}
          $dimension={dimension}
          type="button"
          {...props}
        >
          <BadgeDot
            dimension={dimension === 'l' ? 'm' : 's'}
            appearance={status === undefined ? 'neutral' : (status as TagStatus)}
          />
          {children && (
            <Text $dimension={dimension} ref={textRef}>
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
