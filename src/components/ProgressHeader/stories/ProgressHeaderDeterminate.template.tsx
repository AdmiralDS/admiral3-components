import { ProgressHeader, type ProgressHeaderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressHeaderDeterminateTemplate = (args: ProgressHeaderProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Параметр <code>value</code> задаёт текущее значение прогресса от 0 до 100.
      </StoryDemoDescription>
      <ProgressHeader {...args} />
    </StoryDemoContainer>
  );
};
