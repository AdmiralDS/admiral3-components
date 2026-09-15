import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ChipsWithBadgeTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $direction="column" $gap="12px" $withBackground={false}>
    <StoryDemoDescription>В компоненте можно включать бейджи.</StoryDemoDescription>
    <Chips {...args} badge={5}>
      Chip
    </Chips>
  </StoryDemoContainer>
);
