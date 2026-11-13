import { SystemPersonOutline } from '@admiral-ds/admiral3-icons';

import { ActivityAvatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';
import { ACTIVITY_AVATAR_DIMENSIONS } from '../constants';

export const ActivityAvatarWithIconTemplate = (args: AvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription $textAlign="center">Вместо инициалов можно передать иконку.</StoryDemoDescription>
    <StoryDemoSamples>
      {ACTIVITY_AVATAR_DIMENSIONS.map((dimension) => (
        <StoryDemoSample key={dimension}>
          <ActivityAvatar
            {...args}
            dimension={dimension}
            href={undefined}
            icon={<SystemPersonOutline width="100%" height="100%" aria-hidden="true" focusable="false" />}
          />
          <StoryDemoDescription>{dimension.toUpperCase()}</StoryDemoDescription>
        </StoryDemoSample>
      ))}
    </StoryDemoSamples>
  </StoryDemoContainer>
);
