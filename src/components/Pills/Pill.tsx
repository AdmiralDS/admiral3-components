import type { ReactNode } from 'react';
import { Children, forwardRef, useMemo, useState } from 'react';

import { useOverflow } from '#src/hooks/useOverflow';

import { PillLabel, StyledPill } from './style';
import type { PillProps } from './types';
import { refSetter } from '../../utils/refSetter';
import { Tooltip } from '../Tooltip/Tooltip';
import { useTooltip } from '../Tooltip/useTooltip';

const DEFAULT_APPEARANCE = 'neutral1';

const isTextChild = (child: ReactNode) => typeof child === 'string' || typeof child === 'number';

/** Pill — компактный визуальный индикатор статуса. */
export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  ({ appearance = DEFAULT_APPEARANCE, children, type = 'button', ...props }, ref) => {
    const isCustomAppearance = typeof appearance === 'object';
    const presetAppearance = isCustomAppearance ? DEFAULT_APPEARANCE : appearance;
    const colorConfig = isCustomAppearance ? appearance : undefined;
    const childrenArray = Children.toArray(children);
    const labelIndex = childrenArray.findIndex(isTextChild);
    const labelContent = childrenArray[labelIndex];
    const [labelElement, setLabelElement] = useState<HTMLSpanElement | null>(null);
    const {
      triggerProps: { ref: triggerRef },
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLButtonElement>();
    const hasOverflow = useOverflow(tooltipProps.targetElement, labelElement);
    const mergedRef = useMemo(() => refSetter(ref, triggerRef), [ref, triggerRef]);

    return (
      <>
        <StyledPill
          ref={mergedRef}
          type={type}
          $appearance={presetAppearance}
          $colorConfig={colorConfig}
          {...props}
          data-pill=""
        >
          {childrenArray.map((child, index) =>
            isTextChild(child) ? (
              <PillLabel key={index} ref={index === labelIndex ? setLabelElement : undefined} data-pill-label="">
                {child}
              </PillLabel>
            ) : (
              child
            ),
          )}
        </StyledPill>
        {isVisible && hasOverflow && <Tooltip {...tooltipProps}>{labelContent}</Tooltip>}
      </>
    );
  },
);

Pill.displayName = 'Pill';
