import { forwardRef } from 'react';

import { Icon } from './style';
import type { ListIconProps } from './types';

/**
 * Декоративная иконка-маркер списка. Компонент скрыт от accessibility tree, поэтому передавать ему
 * accessibility-атрибуты не следует.
 */
export const ListIcon = forwardRef<SVGSVGElement, ListIconProps>(({ as, color, ...props }, ref) => {
  return <Icon ref={ref} as={as} $color={color} {...props} aria-hidden="true" focusable="false" />;
});
ListIcon.displayName = 'ListIcon';
