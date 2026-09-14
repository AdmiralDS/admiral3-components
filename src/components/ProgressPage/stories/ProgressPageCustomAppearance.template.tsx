import { ProgressPage, type ProgressPageColorConfig } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const customAppearance: ProgressPageColorConfig = {
  backgroundColor: 'var(--admiral-color-neutral-stroke-subtle-rest)',
  progressColor: 'var(--admiral-color-teal-stroke-1-rest)',
  progressColorError: 'var(--admiral-color-magenta-stroke-1-rest)',
};

export const ProgressPageCustomAppearanceTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Объект в параметре <code>appearance</code> позволяет независимо настроить фон трека, цвет прогресса и цвет
        индикатора в состоянии ошибки. Выбирайте цвета, которые сохраняют достаточный контраст во всех используемых
        темах.
      </StoryDemoDescription>
      <ProgressPage value={45} label="Пользовательский цвет" valueLabel="45%" appearance={customAppearance} />
      <ProgressPage
        value={70}
        error
        label="Пользовательский цвет ошибки"
        valueLabel="70%"
        appearance={customAppearance}
        aria-valuetext="Ошибка загрузки, загружено 70%"
      />
    </StoryDemoContainer>
  );
};
