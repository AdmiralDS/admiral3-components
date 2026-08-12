import { forwardRef } from 'react';

import { Icon } from './style';
import type { ListIconProps } from './types';

export const ListIcon = forwardRef<SVGSVGElement, ListIconProps>(({ as, color, ...props }, ref) => {
  return <Icon ref={ref} role="presentation" as={as} $color={color} {...props} />;
});
ListIcon.displayName = 'ListIcon';
