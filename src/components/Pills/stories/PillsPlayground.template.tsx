import { Pill, type PillProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const PillsPlaygroundTemplate = (args: PillProps) => {
  return (
    <StoryDemoContainer $withBackground={false}>
      <Pill {...args} />
    </StoryDemoContainer>
  );
};
