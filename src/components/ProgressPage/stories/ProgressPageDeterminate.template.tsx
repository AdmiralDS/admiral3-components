import { ProgressPage, type ProgressPageProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressPageDeterminateTemplate = (args: ProgressPageProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Параметр <code>value</code> задаёт текущее значение прогресса от 0 до 100. Подпись значения отображается только
        при явной передаче <code>valueLabel</code>.
      </StoryDemoDescription>
      <ProgressPage {...args} />
    </StoryDemoContainer>
  );
};
