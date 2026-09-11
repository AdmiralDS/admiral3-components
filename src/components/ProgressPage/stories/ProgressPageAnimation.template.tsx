import { useEffect, useState } from 'react';

import { ProgressPage } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressPageAnimationTemplate = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((currentValue) => (currentValue >= 100 ? 0 : currentValue + 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Пример последовательного обновления determinate-прогресса: значение увеличивается на 10 каждую секунду и после
        достижения 100 начинает новый цикл.
      </StoryDemoDescription>
      <ProgressPage value={value} label="Загрузка данных..." valueLabel={`${value}%`} />
    </StoryDemoContainer>
  );
};
