import type { ReactNode } from 'react';
import { Children, forwardRef, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useOverflow } from '#src/hooks/useOverflow';

import { PillsContext } from './PillsContext';
import { PillLabel, StyledPill } from './style';
import type { PillProps } from './types';
import { refSetter } from '../../utils/refSetter';
import { Tooltip } from '../Tooltip/Tooltip';
import { useTooltip } from '../Tooltip/useTooltip';

const DEFAULT_APPEARANCE = 'neutral1';

const isTextChild = (child: ReactNode) => typeof child === 'string' || typeof child === 'number';

/** Pill — компактный визуальный индикатор статуса. */
export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  ({ appearance = DEFAULT_APPEARANCE, children, disabled = false, tabIndex, type = 'button', ...props }, ref) => {
    const pills = useContext(PillsContext);
    const id = useRef(Symbol('pill')).current;
    const pillRef = useRef<HTMLButtonElement | null>(null);
    const [unmanaged, setUnmanaged] = useState(false);
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
    const mergedRef = useMemo(() => refSetter(ref, pillRef, triggerRef), [ref, triggerRef]);
    const registerPill = pills?.registerPill;
    const updatePill = pills?.updatePill;

    useEffect(() => {
      if (!registerPill) return;
      const unregister = registerPill({ id, ref: pillRef, disabled });
      setUnmanaged(!unregister);
      return unregister;
    }, [disabled, id, registerPill]);

    useLayoutEffect(() => {
      updatePill?.(id, disabled);
    }, [disabled, id, updatePill]);

    const managedTabIndex = pills && !unmanaged ? (pills.focusablePillId === id ? 0 : -1) : tabIndex;

    return (
      <>
        <StyledPill
          ref={mergedRef}
          type={type}
          $appearance={presetAppearance}
          $colorConfig={colorConfig}
          {...props}
          disabled={disabled}
          tabIndex={managedTabIndex}
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
