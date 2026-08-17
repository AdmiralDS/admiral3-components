import { Pulse, type PulseProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const PulsePlaygroundTemplate = (args: PulseProps) => {
  return (
    <StoryDemoContainer>
      <Pulse {...args} />
    </StoryDemoContainer>
  );
};
