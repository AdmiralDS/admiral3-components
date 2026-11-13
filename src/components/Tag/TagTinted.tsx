import { forwardRef, useMemo, useState } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';
import { useOverflow } from '#src/hooks/useOverflow';
import { hasSlotContent } from '#src/utils/hasSlotContent';
import { refSetter } from '#src/utils/refSetter';

import { Wrapper, IconsWrapper, Text } from './style';
import type { TagTintedProps } from './types';

export const TagTinted = forwardRef<HTMLButtonElement, TagTintedProps>(
  (
    { children, dimension = 'm', withBorder = false, iconsBefore, onClick, status = 'neutral', tabIndex, ...props },
    ref,
  ) => {
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
    const textColor = colorConfig?.textColor;
    const hasIcons = hasSlotContent(iconsBefore);
    const hasText = hasSlotContent(children);
    const showTooltip = isVisible && textOverflow;

    return (
      <>
        <Wrapper
          ref={wrapperRef}
          onClick={onClick}
          $clickable={active}
          $status={presetStatus}
          $colorConfig={colorConfig}
          $dimension={dimension}
          $withBorder={withBorder}
          tabIndex={resolvedTabIndex}
          type="button"
          {...props}
        >
          {hasIcons && <IconsWrapper $dimension={dimension}>{iconsBefore}</IconsWrapper>}
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

TagTinted.displayName = 'TagTinted';
