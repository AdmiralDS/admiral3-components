import { useState } from 'react';

import { CheckBox, CheckBoxGroup, type CheckBoxGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const renderOptions = () => (
  <>
    <CheckBox value="notifications">Уведомления</CheckBox>
    <CheckBox value="analytics">Аналитика</CheckBox>
    <CheckBox value="offers">Специальные предложения</CheckBox>
  </>
);

export const CheckBoxGroupControlledUncontrolledTemplate = (args: CheckBoxGroupProps) => {
  const [controlledValue, setControlledValue] = useState<string[]>(['notifications']);

  return (
    <StoryDemoContainer $direction="column" $gap="40px">
      <StoryDemoDescription>
        Controlled-группа получает массив выбранных значений через value и обновляет его в обработчике onChange.
      </StoryDemoDescription>
      <CheckBoxGroup
        {...args}
        name="controlled-subscriptions"
        legend="Controlled CheckBoxGroup"
        value={controlledValue}
        onChange={setControlledValue}
      >
        {renderOptions()}
      </CheckBoxGroup>

      <StoryDemoDescription>
        Uncontrolled-группа получает только начальный массив выбранных значений через defaultValue.
      </StoryDemoDescription>
      <CheckBoxGroup
        {...args}
        name="uncontrolled-subscriptions"
        legend="Uncontrolled CheckBoxGroup"
        defaultValue={['analytics', 'offers']}
      >
        {renderOptions()}
      </CheckBoxGroup>
    </StoryDemoContainer>
  );
};
