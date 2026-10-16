import type { HTMLAttributes } from 'react';

import type { AVATAR_DIMENSIONS } from './constants';

export type AvatarDimension = (typeof AVATAR_DIMENSIONS)[number];

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: AvatarDimension;
}

export interface StyledAvatarProps {
  $dimension: AvatarDimension;
}
