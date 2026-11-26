import { Chip, type ChipBaseProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ChipTemplate = (args: ChipBaseProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Базовый Chip с текстом и необязательным бейджем. Контролы позволяют настроить размер, оформление и цветовой режим,
      а также состояния disabled и readOnly. Если текст не помещается, то отображается подсказка с полным содержимым.
    </StoryDemoDescription>
    <Chip {...args} />
  </StoryDemoContainer>
);
