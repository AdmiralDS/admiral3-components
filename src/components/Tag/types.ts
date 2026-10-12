import type { HTMLAttributes } from 'react';

import type { TAG_DIMENSIONS } from './constants';

export type TagDimension = (typeof TAG_DIMENSIONS)[number];

export interface TagProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TagDimension;
}

export interface StyledTagProps {
  $dimension: TagDimension;
}
