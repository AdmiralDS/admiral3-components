import { forwardRef } from 'react';

import { StyledTemplateName } from './style';
import type { TemplateNameProps } from './types';

/** TemplateName primitive component. */
export const TemplateName = forwardRef<HTMLDivElement, TemplateNameProps>(
  ({ children, dimension = 'm', ...props }, ref) => {
    return (
      <StyledTemplateName ref={ref} {...props} $dimension={dimension}>
        {children}
      </StyledTemplateName>
    );
  },
);

TemplateName.displayName = 'TemplateName';
