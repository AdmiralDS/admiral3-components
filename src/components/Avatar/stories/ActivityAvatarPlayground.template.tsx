import { ActivityAvatar, type ActivityAvatarProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ActivityAvatarTemplate = (args: ActivityAvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription $textAlign="center">
      Avatar с Activity Ring. Вокруг компонента под круг появляется пустое пространство по 4 px с каждой стороны, что бы
      он (круг) при включении входил в общий размер компонента и не обрезался во фреймах.
      <code>withActivityRing</code> резервирует место под кольцо, а <code>showActivityRing</code> управляет его
      видимостью.
    </StoryDemoDescription>
    <ActivityAvatar {...args} />
  </StoryDemoContainer>
);
