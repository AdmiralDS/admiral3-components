import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';

export const AvatarActiveAndPassiveTemplate = (args: AvatarProps) => {
  const handleClick = () => {
    // eslint-disable-next-line no-console
    console.log('click');
  };

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription $textAlign="center">
        Активный аватар доступен с клавиатуры и реагирует на нажатие. Пассивный аватар отображает пользователя и
        пропускается при навигации клавишей Tab.
      </StoryDemoDescription>
      <StoryDemoSamples>
        <StoryDemoSample>
          <Avatar {...args} onClick={handleClick} showTooltip={false} />
          <StoryDemoDescription>Активный</StoryDemoDescription>
        </StoryDemoSample>
        <StoryDemoSample>
          <Avatar {...args} showTooltip={false} />
          <StoryDemoDescription>Пассивный</StoryDemoDescription>
        </StoryDemoSample>
      </StoryDemoSamples>
    </StoryDemoContainer>
  );
};
