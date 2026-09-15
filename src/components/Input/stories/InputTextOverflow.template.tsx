import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputTextOverflowTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      По умолчанию при наведении на поле с переполненным значением отображается подсказка с полным текстом. Поведение
      можно отключить через <code>showTooltip</code>.
    </StoryDemoDescription>
    <StoryDemoItem>
      <Input {...args} aria-label="Поле с переполненным текстом" />
    </StoryDemoItem>
  </StoryDemoContainer>
);
