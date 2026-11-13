import { ActivityAvatar, type ActivityAvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';

export const ActivityAvatarTooltipTemplate = (args: ActivityAvatarProps) => {
  const handleClick = () => {
    // eslint-disable-next-line no-console
    console.log('click');
  };

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription $textAlign="center">
        ActivityAvatar показывает <code>userName</code> в Tooltip при наведении или фокусе (если компонент активный),
        его можно отключить с помощью <code>showTooltip</code>.
      </StoryDemoDescription>
      <StoryDemoSamples>
        <StoryDemoSample>
          <ActivityAvatar {...args} onClick={handleClick} />
          <StoryDemoDescription>Активный Avatar</StoryDemoDescription>
        </StoryDemoSample>
        <StoryDemoSample>
          <ActivityAvatar {...args} />
          <StoryDemoDescription>Пассивный Avatar</StoryDemoDescription>
        </StoryDemoSample>
      </StoryDemoSamples>
    </StoryDemoContainer>
  );
};
