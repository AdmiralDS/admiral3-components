import { TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaPlaygroundTemplate = (args: TextAreaProps) => (
  <StoryDemoContainer>
    <StoryDemoItem>
      <TextArea aria-label="Текст" {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
