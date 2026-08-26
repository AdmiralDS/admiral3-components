import { BadgeDot, type BadgeDotProps } from '@admiral-ds/admiral3-components';

import { StoryDirtyContainer } from '../../stories/StoryContainers';
import { BADGE_DOT_APPEARANCES, BADGE_DOT_DIMENSIONS } from '../constants';

export const BadgeDotDirtyTemplate = (args: BadgeDotProps) => {
  return (
    <StoryDirtyContainer>
      {BADGE_DOT_APPEARANCES.map((appearance) =>
        BADGE_DOT_DIMENSIONS.map((dimension) => (
          <BadgeDot key={`${appearance}-${dimension}`} {...args} appearance={appearance} dimension={dimension} />
        )),
      )}
    </StoryDirtyContainer>
  );
};
