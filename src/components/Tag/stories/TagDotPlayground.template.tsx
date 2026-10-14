import { TagDot, type TagNeutralProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const TagDotPlaygroundTemplate = (args: TagNeutralProps) => {
  return (
    <StoryDemoContainer $withBackground={false}>
      <TagDot {...args}>Tag</TagDot>
    </StoryDemoContainer>
  );
};
