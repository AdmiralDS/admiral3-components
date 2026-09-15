import {
  ProgressHeader,
  type ProgressHeaderColorConfig,
  type ProgressHeaderProps,
} from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const customAppearance: ProgressHeaderColorConfig = {
  backgroundColor: 'var(--admiral-color-neutral-stroke-subtle-rest)',
  progressColor: 'var(--admiral-color-teal-stroke-1-rest)',
  progressColorError: 'var(--admiral-color-magenta-stroke-1-rest)',
};

export const ProgressHeaderCustomAppearanceTemplate = (args: ProgressHeaderProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Объект в параметре <code>appearance</code> позволяет независимо настроить фон трека, цвет прогресса и цвет
        индикатора в состоянии ошибки. Выбирайте цвета, которые сохраняют достаточный контраст во всех используемых
        темах.
      </StoryDemoDescription>
      <ProgressHeader {...args} appearance={customAppearance} />
    </StoryDemoContainer>
  );
};
