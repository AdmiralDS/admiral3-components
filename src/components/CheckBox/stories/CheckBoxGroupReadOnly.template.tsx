import { CheckBox, CheckBoxGroup, type CheckBoxGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const CheckBoxGroupReadOnlyTemplate = (args: CheckBoxGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="20px">
    <StoryDemoDescription>
      В режиме readOnly все CheckBox в группе сохраняют фокусируемость, но выбранные значения нельзя изменить.
    </StoryDemoDescription>
    <CheckBoxGroup
      {...args}
      name="readonly-subscriptions"
      legend="Выберите подписки"
      defaultValue={['notifications', 'offers']}
      readOnly
    >
      <CheckBox value="notifications">Уведомления</CheckBox>
      <CheckBox value="analytics">Аналитика</CheckBox>
      <CheckBox value="offers">Специальные предложения</CheckBox>
    </CheckBoxGroup>
  </StoryDemoContainer>
);
