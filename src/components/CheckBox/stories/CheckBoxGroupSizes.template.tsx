import { CheckBox, CheckBoxGroup, type CheckBoxGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const renderOptions = () => (
  <>
    <CheckBox value="notifications">Уведомления</CheckBox>
    <CheckBox value="analytics">Аналитика</CheckBox>
    <CheckBox value="offers">Специальные предложения</CheckBox>
  </>
);

export const CheckBoxGroupSizesTemplate = (args: CheckBoxGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="40px">
    <CheckBoxGroup {...args} name="subscriptions-m" legend="Выберите подписки" dimension="m">
      {renderOptions()}
    </CheckBoxGroup>
    <CheckBoxGroup {...args} name="subscriptions-s" legend="Выберите подписки" dimension="s">
      {renderOptions()}
    </CheckBoxGroup>
    <CheckBoxGroup {...args} name="subscriptions-xs" legend="Выберите подписки" dimension="xs" disabled>
      {renderOptions()}
    </CheckBoxGroup>
  </StoryDemoContainer>
);
