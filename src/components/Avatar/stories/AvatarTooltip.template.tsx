import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';

export const AvatarTooltipTemplate = (args: AvatarProps) => {
  const handleClick = () => {
    // eslint-disable-next-line no-console
    console.log('click');
  };

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription $textAlign="center">
        Avatar показывает <code>userName</code> в Tooltip при наведении или фокусе (если компонент активный), его можно
        отключить с помощью <code>showTooltip</code>.
      </StoryDemoDescription>
      <StoryDemoSamples>
        <StoryDemoSample>
          <Avatar {...args} onClick={handleClick} />
          <StoryDemoDescription>Активный Avatar</StoryDemoDescription>
        </StoryDemoSample>
        <StoryDemoSample>
          <Avatar {...args} />
          <StoryDemoDescription>Пассивный Avatar</StoryDemoDescription>
        </StoryDemoSample>
      </StoryDemoSamples>
    </StoryDemoContainer>
  );
};
