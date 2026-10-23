import { forwardRef, useMemo, useState } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { useOverflow } from '#src/hooks/useOverflow';
import { hasSlotContent } from '#src/utils/hasSlotContent';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, Text, StatusDot } from './style';
import type { TagDotProps } from './types';

export const TagDot = forwardRef<HTMLButtonElement, TagDotProps>(
  ({ children, dimension = 'm', withBorder = false, onClick, status = 'neutral', tabIndex, ...props }, ref) => {
    const [contentElement, setContentElement] = useState<HTMLSpanElement | null>(null);

    const {
      triggerProps: { ref: triggerRef },
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLButtonElement>();

    const textOverflow = useOverflow(tooltipProps.targetElement, contentElement);
    const wrapperRef = useMemo(() => refSetter(ref, triggerRef), [ref, triggerRef]);

    const active = !!onClick;
    const customStatus = typeof status === `object`;
    const presetStatus = customStatus ? 'neutral' : status;
    const colorConfig = customStatus ? status : undefined;
    const resolvedTabIndex = tabIndex ?? (active ? 0 : -1);
    const dotDimension = dimension === 'l' ? 'm' : 's';
    const dotAppearance = colorConfig?.dotAppearance ?? presetStatus;
    const hasText = hasSlotContent(children);
    const textColor = colorConfig?.textColor;
    const showTooltip = isVisible && textOverflow;

    return (
      <>
        <Wrapper
          ref={wrapperRef}
          onClick={onClick}
          $clickable={active}
          $withBorder={withBorder}
          $dimension={dimension}
          $status="neutral"
          $colorConfig={colorConfig}
          tabIndex={resolvedTabIndex}
          type="button"
          {...props}
        >
          <StatusDot dimension={dotDimension} appearance={dotAppearance} />
          {hasText && (
            <Text $dimension={dimension} $textColor={textColor} ref={setContentElement}>
              {children}
            </Text>
          )}
        </Wrapper>
        {showTooltip && <Tooltip {...tooltipProps}>{children}</Tooltip>}
      </>
    );
  },
);

TagDot.displayName = 'TagDot';
