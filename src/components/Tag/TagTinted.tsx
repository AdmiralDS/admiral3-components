import { forwardRef, useRef } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { hasSlotContent } from '#src/utils/hasSlotContent';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, Icon, Text } from './style';
import type { TagProps } from './types';

export const TagTinted = forwardRef<HTMLButtonElement, TagProps>(
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
          {...props}
        >
          {hasSlotContent(iconsBefore) && <Icon $dimension={dimension}>{iconsBefore}</Icon>}
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

TagTinted.displayName = 'TagTinted';
