import { forwardRef } from 'react';

import { AvatarBase } from './AvatarBase';
import type { ActivityAvatarProps } from './types';

export const ActivityAvatar = forwardRef<HTMLButtonElement, ActivityAvatarProps>(
  ({ showActivityRing = false, ...props }, ref) => {
    return <AvatarBase ref={ref} {...props} withActivityRing={true} showActivityRing={showActivityRing} />;
  },
);

ActivityAvatar.displayName = 'ActivityAvatar';
