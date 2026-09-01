import { RadioButton, RadioGroup, type RadioGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const RadioGroupPlaygroundTemplate = (args: RadioGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      RadioButton используется в составе RadioGroup, который задаёт общие имя, размер, состояние и расположение
      вариантов. Каждый RadioButton в составе группы должен иметь явно заданный уникальный value.
    </StoryDemoDescription>
    <RadioGroup {...args}>
      <RadioButton value="courier">Курьером</RadioButton>
      <RadioButton value="pickup">Самовывоз</RadioButton>
      <RadioButton value="post">Почтой</RadioButton>
    </RadioGroup>
  </StoryDemoContainer>
);
