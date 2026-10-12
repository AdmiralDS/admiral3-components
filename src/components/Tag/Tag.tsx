import { forwardRef, useRef } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, Icon, Text, StatusIcon } from './style';
import { BadgeDot } from '../BadgeDot';
import type { TagProps, TagStatus } from './types';

export const Tag = forwardRef<HTMLButtonElement, TagProps>(
  (
    { children, appearance = 'neutral', dimension = 'm', withBorder = false, iconsBefore, onClick, status, ...props },
    ref,
  ) => {
    const textRef = useRef<HTMLElement>(null);

    const tagColored = appearance === 'colored';

    const {
      targetProps: { ref: targetRef, ...targetProps },
      // targetProps,
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLButtonElement>();

    // const background: TagKind | string =
    //   typeof kind === 'object' ? (kind.background ? kind.background : 'neutral') : (kind as TagKind);
    // const border: TagKind | string = isBorderHidden
    //   ? 'transparent'
    //   : typeof kind === 'object'
    //     ? !!kind.background && !!kind.border
    //       ? kind.border
    //       : 'neutral'
    //     : (kind as TagKind);
    // const backgroundHover: TagKind | string =
    //   typeof kind === 'object'
    //     ? kind.backgroundHover
    //       ? kind.backgroundHover
    //       : kind.background
    //         ? kind.background
    //         : 'neutral'
    //     : (kind as TagKind);

    return (
      <>
        <Wrapper
          {...targetProps}
          ref={refSetter(ref, targetRef)}
          onClick={onClick}
          $clickable={!!onClick}
          $statusViaBackground={statusViaBackground}
          $border={border}
          $background={background}
          $backgroundHover={backgroundHover}
          $dimension={dimension}
          type="button"
          {...props}
        >
          {!tagColored && (
            <BadgeDot
              dimension={dimension === 'l' ? 'm' : 's'}
              appearance={status === undefined ? 'neutral' : (status as TagStatus)}
            />
          )}
          {tagColored && iconsBefore && <Icon>{iconsBefore}</Icon>}
          {children && (
            <Text $dimension={dimension} ref={textRef}>
              {children}
            </Text>
          )}
          {/* {statusIcon && <StatusIcon>{statusIcon}</StatusIcon>} */}
        </Wrapper>
        {isVisible && <Tooltip {...tooltipProps}>{children}</Tooltip>}
      </>
    );
  },
);

Tag.displayName = 'Tag';
