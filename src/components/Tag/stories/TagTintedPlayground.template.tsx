import { TagTinted, type TagColoredProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const TagTintedPlaygroundTemplate = (args: TagColoredProps) => {
  return (
    <StoryDemoContainer $withBackground={false}>
      <TagTinted {...args}>Tag</TagTinted>
    </StoryDemoContainer>
  );
};
