import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components';

import { StoryDirtyContainer } from '../../stories/StoryContainers';
import { BADGE_APPEARANCES, BADGE_DIMENSIONS } from '../constants';

export const BadgeDirtyTemplate = (args: BadgeProps) => {
  return (
    <StoryDirtyContainer>
      {BADGE_APPEARANCES.map((appearance) =>
        BADGE_DIMENSIONS.map((dimension) => (
          <Badge key={`${appearance}-${dimension}`} {...args} appearance={appearance} dimension={dimension}>
            {dimension === 's' ? 5 : 159}
          </Badge>
        )),
      )}
    </StoryDirtyContainer>
  );
};
