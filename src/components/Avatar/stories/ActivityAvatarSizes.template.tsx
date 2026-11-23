import { ActivityAvatar, type ActivityAvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';
import { ACTIVITY_AVATAR_DIMENSIONS } from '../constants';

export const ActivityAvatarSizesTemplate = (args: ActivityAvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoSamples>
      {ACTIVITY_AVATAR_DIMENSIONS.map((dimension) => (
        <StoryDemoSample key={dimension}>
          <ActivityAvatar {...args} dimension={dimension} />
          <StoryDemoDescription>{dimension.toUpperCase()}</StoryDemoDescription>
        </StoryDemoSample>
      ))}
    </StoryDemoSamples>
  </StoryDemoContainer>
);
