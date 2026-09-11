import { ProgressHeader } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressHeaderIndeterminateTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Если параметр <code>value</code> не задан, компонент отображается в состоянии indeterminate, при котором процесс
        выполняется, но его текущий прогресс или время завершения неизвестны.
      </StoryDemoDescription>
      <ProgressHeader aria-label="Загрузка страницы" />
    </StoryDemoContainer>
  );
};
