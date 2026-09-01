import { textStyles } from '@admiral-ds/admiral3-tokens';
import type { CSSObject } from 'styled-components';

import { INPUT_DIMENSIONS } from '../_internal/InputAtoms/constants';

export const FIELDSET_DIMENSIONS = INPUT_DIMENSIONS;
export const FIELDSET_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const FIELDSET_DIMENSION_PARAMETERS: Record<
  (typeof FIELDSET_DIMENSIONS)[number],
  {
    gap: Record<(typeof FIELDSET_ORIENTATIONS)[number], number>;
    typography: CSSObject;
  }
> = {
  m: {
    gap: { horizontal: 24, vertical: 16 },
    typography: textStyles.body.body1Long,
  },
  s: {
    gap: { horizontal: 20, vertical: 12 },
    typography: textStyles.body.body2Long,
  },
  xs: {
    gap: { horizontal: 16, vertical: 12 },
    typography: textStyles.caption.caption1,
  },
};
