import { forwardRef } from 'react';

import { StyledAvatar } from './style';
import type { AvatarProps } from './types';

/** Avatar primitive component. */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, dimension = 'm', ...props }, ref) => {
    return (
      <StyledAvatar ref={ref} {...props} $dimension={dimension}>
        {children}
      </StyledAvatar>
    );
  },
);

Avatar.displayName = 'Avatar';
