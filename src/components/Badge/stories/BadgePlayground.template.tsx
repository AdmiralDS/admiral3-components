import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const BadgePlaygroundTemplate = (args: BadgeProps) => {
  return (
    <StoryDemoContainer>
      <Badge {...args} />
    </StoryDemoContainer>
  );
};
