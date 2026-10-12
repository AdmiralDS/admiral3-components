import { Children, forwardRef } from 'react';

import { PillLabel, StyledPill } from './style';
import type { PillProps } from './types';

const DEFAULT_APPEARANCE = 'neutral1';

/** Pill — компактный визуальный индикатор статуса. */
export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  ({ appearance = DEFAULT_APPEARANCE, children, type = 'button', ...props }, ref) => {
    const isCustomAppearance = typeof appearance === 'object';
    const presetAppearance = isCustomAppearance ? DEFAULT_APPEARANCE : appearance;
    const colorConfig = isCustomAppearance ? appearance : undefined;

    return (
      <StyledPill
        ref={ref}
        type={type}
        $appearance={presetAppearance}
        $colorConfig={colorConfig}
        {...props}
        data-pill=""
      >
        {/* TODO: Подключить Tooltip после появления компонента и показывать полный текст только при переполнении. */}
        {Children.toArray(children).map((child, index) =>
          typeof child === 'string' || typeof child === 'number' ? (
            <PillLabel key={`${String(child)}-${index}`}>{child}</PillLabel>
          ) : (
            child
          ),
        )}
      </StyledPill>
    );
  },
);

Pill.displayName = 'Pill';
