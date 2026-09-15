import { ProgressPage } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressPageIndeterminateTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Если параметр <code>value</code> не задан, компонент отображается в состоянии indeterminate, при котором процесс
        выполняется, но его текущий прогресс или время завершения неизвестны. Вместо заполнения до конкретного значения
        компонент показывает непрерывно движущийся индикатор.
      </StoryDemoDescription>
      <ProgressPage label="Загрузка данных..." />
    </StoryDemoContainer>
  );
};
