import { Button, type ButtonProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const ButtonDirtyTemplate = (args: ButtonProps) => {
  return (
    <StoryDemoContainer>
      <Button {...args} />
    </StoryDemoContainer>
  );
};
