import { Chip, type ChipBaseProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ChipWithBadgeTemplate = (args: ChipBaseProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Проп badge выводит число справа от текста чипса.</StoryDemoDescription>
    <Chip {...args} />
  </StoryDemoContainer>
);
