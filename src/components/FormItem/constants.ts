import { textStyles } from '@admiral-ds/admiral3-tokens';
import type { CSSObject } from 'styled-components';

import { BASE_INPUT_DIMENSIONS, BASE_INPUT_STATUSES } from '../_internal/InputAtoms/constants';

export const FORM_ITEM_DIMENSIONS = BASE_INPUT_DIMENSIONS;
export const FORM_ITEM_STATUSES = BASE_INPUT_STATUSES;

export const FORM_ITEM_DIMENSION_PARAMETERS: Record<
  (typeof FORM_ITEM_DIMENSIONS)[number],
  { gap: number; labelGap: number; typography: CSSObject }
> = {
  l: { gap: 8, labelGap: 8, typography: textStyles.body.body2Short },
  m: { gap: 8, labelGap: 8, typography: textStyles.body.body2Short },
  s: { gap: 8, labelGap: 6, typography: textStyles.body.body2Short },
  xs: { gap: 6, labelGap: 6, typography: textStyles.caption.caption1 },
};
