import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';
import { AVATAR_DIMENSIONS } from '../constants';

export const AvatarSizesTemplate = (args: AvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoSamples>
      {AVATAR_DIMENSIONS.map((dimension) => (
        <StoryDemoSample key={dimension}>
          <Avatar {...args} dimension={dimension} />
          <StoryDemoDescription>{dimension.toUpperCase()}</StoryDemoDescription>
        </StoryDemoSample>
      ))}
    </StoryDemoSamples>
  </StoryDemoContainer>
);
