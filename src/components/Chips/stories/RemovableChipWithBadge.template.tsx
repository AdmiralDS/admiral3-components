import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const RemovableChipWithBadgeTemplate = (args: RemovableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>В компоненте можно включать бейджи.</StoryDemoDescription>
    <RemovableChip {...args} badge={5} />
  </StoryDemoContainer>
);
