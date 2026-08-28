import { CheckBox, CheckBoxGroup, type CheckBoxGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const CheckBoxGroupPlaygroundTemplate = (args: CheckBoxGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      CheckBoxGroup задаёт общие размер, состояние и расположение вариантов, а выбранные значения хранит в массиве.
    </StoryDemoDescription>
    <CheckBoxGroup {...args}>
      <CheckBox value="notifications">Уведомления</CheckBox>
      <CheckBox value="analytics">Аналитика</CheckBox>
      <CheckBox value="offers">Специальные предложения</CheckBox>
    </CheckBoxGroup>
  </StoryDemoContainer>
);
