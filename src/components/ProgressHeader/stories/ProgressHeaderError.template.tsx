import { ProgressHeader } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressHeaderErrorTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Параметр <code>error</code> переводит компонент в состояние ошибки и меняет цвет индикатора соответствующим
        образом.
      </StoryDemoDescription>
      <ProgressHeader value={62} error aria-label="Не удалось загрузить страницу" />
    </StoryDemoContainer>
  );
};
