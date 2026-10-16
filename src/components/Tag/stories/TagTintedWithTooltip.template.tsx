import styled from 'styled-components';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const TruncatedTag = styled(TagTinted)`
  max-width: 200px;
`;

export const TagTintedWithTooltipTemplate = (args: TagTintedProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Наведите указатель на тег или перейдите к нему клавишей Tab: встроенный Tooltip покажет полный текст. Нажмите
      Escape, чтобы закрыть подсказку.
    </StoryDemoDescription>
    <TruncatedTag {...args}>Документ согласован всеми участниками рабочего процесса</TruncatedTag>
  </StoryDemoContainer>
);
