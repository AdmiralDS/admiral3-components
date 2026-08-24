import { forwardRef } from 'react';

import { StyledDivider } from './style';
import type { DividerProps } from './types';

const DEFAULT_APPEARANCE = 'default';

/** Разделитель контента. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    { dimension = 'm', appearance = DEFAULT_APPEARANCE, orientation = 'horizontal', length = '100%', ...props },
    ref,
  ) => {
    const isCustomAppearance = typeof appearance === 'object';
    const presetAppearance = isCustomAppearance ? DEFAULT_APPEARANCE : appearance;
    const colorConfig = isCustomAppearance ? appearance : undefined;

    return (
      <StyledDivider
        ref={ref}
        $dimension={dimension}
        $appearance={presetAppearance}
        $colorConfig={colorConfig}
        $orientation={orientation}
        $length={length}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';
