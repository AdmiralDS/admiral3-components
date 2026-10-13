import { TagDot, type TagNeutralProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const TagPlaygroundTemplate = (args: TagNeutralProps) => {
  return (
    <StoryDemoContainer>
      <TagDot {...args} />
    </StoryDemoContainer>
  );
};
