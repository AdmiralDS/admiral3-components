import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const TagTintedPlaygroundTemplate = (args: TagTintedProps) => {
  return (
    <StoryDemoContainer $withBackground={false}>
      <TagTinted {...args}>Tag</TagTinted>
    </StoryDemoContainer>
  );
};
