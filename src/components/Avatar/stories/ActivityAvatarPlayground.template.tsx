import { ActivityAvatar, type ActivityAvatarProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ActivityAvatarTemplate = (args: ActivityAvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription $textAlign="center">
      ActivityAvatar резервирует по 4 px с каждой стороны для Activity Ring независимо от его видимости. Свойство{' '}
      <code>showActivityRing</code> управляет отображением кольца, не изменяя общий размер компонента.
    </StoryDemoDescription>
    <ActivityAvatar {...args} />
  </StoryDemoContainer>
);
