import { Spinner, type SpinnerProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const SpinnerPlaygroundTemplate = (args: SpinnerProps) => {
  return (
    <StoryDemoContainer>
      <Spinner {...args} />
    </StoryDemoContainer>
  );
};
