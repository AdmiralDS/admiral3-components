import { forwardRef, useRef } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, Icon, Text } from './style';
import type { TagColoredProps } from './types';

export const TagTinted = forwardRef<HTMLButtonElement, TagColoredProps>(
  ({ children, dimension = 'm', withBorder = false, iconsBefore, onClick, status, ...props }, ref) => {
    const textRef = useRef<HTMLElement>(null);

    const {
      targetProps: { ref: targetRef, ...targetProps },
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLButtonElement>();

    const customStatus = typeof status === `object`;

    return (
      <>
        <Wrapper
          {...targetProps}
          ref={refSetter(ref, targetRef)}
          onClick={onClick}
          $clickable={!!onClick}
          $border={customStatus ? status.border : status}
          $background={customStatus ? status.background : status}
          $backgroundHover={customStatus ? status.backgroundHover : status}
          $backgroundPress={customStatus ? status.backgroundPress : status}
          $dimension={dimension}
          $withBorder={withBorder}
          type="button"
          {...props}
        >
          {iconsBefore && <Icon $dimension={dimension}>{iconsBefore}</Icon>}
          {children && (
            <Text $dimension={dimension} $colorText={customStatus ? status.backgroundPress : undefined} ref={textRef}>
              {children}
            </Text>
          )}
        </Wrapper>
        {isVisible && <Tooltip {...tooltipProps}>{children}</Tooltip>}
      </>
    );
  },
);

TagTinted.displayName = 'TagTinted';
