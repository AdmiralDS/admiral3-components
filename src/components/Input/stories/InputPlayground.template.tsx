import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const InputPlaygroundTemplate = (args: InputProps) => {
  return (
    <StoryDemoContainer>
      <Input {...args} />
    </StoryDemoContainer>
  );
};
