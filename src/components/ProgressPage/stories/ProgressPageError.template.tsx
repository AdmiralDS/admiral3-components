import { ProgressPage } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressPageErrorTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Параметр <code>error</code> переводит компонент в состояние ошибки и меняет цвет индикатора соответствующим
        образом.
      </StoryDemoDescription>
      <ProgressPage
        value={62}
        error
        label="Ошибка загрузки"
        valueLabel="62%"
        aria-valuetext="Ошибка загрузки, загружено 62%"
      />
    </StoryDemoContainer>
  );
};
