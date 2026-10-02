import type { HTMLAttributes } from 'react';

import type { HINT_DIMENSIONS } from './constants';

export type HintDimension = (typeof HINT_DIMENSIONS)[number];

export interface HintProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: HintDimension;
}

export interface StyledHintProps {
  $dimension: HintDimension;
}
