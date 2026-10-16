import { TagDot, type TagDotProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const TagDotPlaygroundTemplate = (args: TagDotProps) => {
  return (
    <StoryDemoContainer $withBackground={false}>
      <TagDot {...args}>Tag</TagDot>
    </StoryDemoContainer>
  );
};
