import styled from 'styled-components';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const TruncatedTag = styled(TagTinted)`
  max-width: 200px;
`;

export const TagTintedWithTooltipTemplate = (args: TagTintedProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Если задана максимальная ширина тега и текст обрезается до многоточия, при наведении или фокусе появляется Tooltip
      с полным текстом. В этом примере максимальная ширина — 200 px.
    </StoryDemoDescription>
    <TruncatedTag {...args}>Документ согласован всеми участниками рабочего процесса</TruncatedTag>
  </StoryDemoContainer>
);
