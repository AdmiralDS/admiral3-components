import type { HTMLAttributes } from 'react';

import type { TEMPLATE_NAME_DIMENSIONS } from './constants';

export type TemplateNameDimension = (typeof TEMPLATE_NAME_DIMENSIONS)[number];

export interface TemplateNameProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: TemplateNameDimension;
}

export interface StyledTemplateNameProps {
  $dimension: TemplateNameDimension;
}
