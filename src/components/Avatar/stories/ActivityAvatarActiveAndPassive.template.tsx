import { ActivityAvatar, type ActivityAvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';

export const ActivityAvatarActiveAndPassiveTemplate = (args: ActivityAvatarProps) => {
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
          <ActivityAvatar {...args} onClick={handleClick} />
          <StoryDemoDescription>Активный</StoryDemoDescription>
        </StoryDemoSample>
        <StoryDemoSample>
          <ActivityAvatar {...args} onClick={undefined} />
          <StoryDemoDescription>Пассивный</StoryDemoDescription>
        </StoryDemoSample>
      </StoryDemoSamples>
    </StoryDemoContainer>
  );
};
