import { ProgressPage, type ProgressPageProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressPagePlaygroundTemplate = (args: ProgressPageProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Компонент для отображения прогресса загрузки страницы, либо контента на странице. Может изменяться по ширине,
        минимальный размер 140px.
      </StoryDemoDescription>
      <ProgressPage {...args} />
    </StoryDemoContainer>
  );
};
