import { Children, forwardRef, useMemo } from 'react';

import { PillLabel, StyledPill } from './style';
import type { PillProps } from './types';
import { usePillTooltip } from './usePillTooltip';
import { refSetter } from '../../utils/refSetter';
import { Tooltip } from '../Tooltip/Tooltip';

const DEFAULT_APPEARANCE = 'neutral1';

/** Pill — компактный визуальный индикатор статуса. */
export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  ({ appearance = DEFAULT_APPEARANCE, children, type = 'button', ...props }, ref) => {
    const isCustomAppearance = typeof appearance === 'object';
    const presetAppearance = isCustomAppearance ? DEFAULT_APPEARANCE : appearance;
    const colorConfig = isCustomAppearance ? appearance : undefined;
    const { triggerRef, tooltipProps, content, isVisible } = usePillTooltip(children);
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
          {Children.toArray(children).map((child, index) =>
            typeof child === 'string' || typeof child === 'number' ? (
              <PillLabel key={`${String(child)}-${index}`} data-pill-label="">
                {child}
              </PillLabel>
            ) : (
              child
            ),
          )}
        </StyledPill>
        {isVisible && (
          // Полный текст уже доступен в имени кнопки; подсказка не должна озвучивать его повторно.
          <Tooltip {...tooltipProps} aria-hidden="true">
            {content}
          </Tooltip>
        )}
      </>
    );
  },
);

Pill.displayName = 'Pill';
