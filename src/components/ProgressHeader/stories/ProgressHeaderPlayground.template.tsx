import { ProgressHeader, type ProgressHeaderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ProgressHeaderPlaygroundTemplate = (args: ProgressHeaderProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        ProgressHeader показывает визуальный прогресс загрузки страницы. Компонент отображается непосредственно под
        шапкой браузера на самом верху рабочей области сайта. Ширина равняется ширине окна браузера.
      </StoryDemoDescription>
      <ProgressHeader {...args} />
    </StoryDemoContainer>
  );
};
