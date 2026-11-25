import { ActivityAvatar, type ActivityAvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';
import { AVATAR_STATUSES } from '../constants';

export const ActivityAvatarStatusesTemplate = (args: ActivityAvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoSamples>
      <StoryDemoSample>
        <ActivityAvatar {...args} status={undefined} />
        <StoryDemoDescription>Без статуса</StoryDemoDescription>
      </StoryDemoSample>
      {AVATAR_STATUSES.map((status) => (
        <StoryDemoSample key={status}>
          <ActivityAvatar {...args} status={status} />
          <StoryDemoDescription>{status}</StoryDemoDescription>
        </StoryDemoSample>
      ))}
    </StoryDemoSamples>
  </StoryDemoContainer>
);
