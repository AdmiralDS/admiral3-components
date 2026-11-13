import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';
import { AVATAR_STATUSES } from '../constants';

export const AvatarStatusesTemplate = (args: AvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoSamples>
      <StoryDemoSample>
        <Avatar {...args} status={undefined} />
        <StoryDemoDescription>Без статуса</StoryDemoDescription>
      </StoryDemoSample>
      {AVATAR_STATUSES.map((status) => (
        <StoryDemoSample key={status}>
          <Avatar {...args} status={status} />
          <StoryDemoDescription>{status}</StoryDemoDescription>
        </StoryDemoSample>
      ))}
    </StoryDemoSamples>
  </StoryDemoContainer>
);
