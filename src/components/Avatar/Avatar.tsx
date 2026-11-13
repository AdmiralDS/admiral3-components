import { forwardRef } from 'react';

import { AvatarBase } from './AvatarBase';
import type { AvatarProps } from './types';

export const Avatar = forwardRef<HTMLButtonElement, AvatarProps>((props, ref) => {
  return <AvatarBase ref={ref} {...props} withActivityRing={false} showActivityRing={false} />;
});

Avatar.displayName = 'Avatar';
