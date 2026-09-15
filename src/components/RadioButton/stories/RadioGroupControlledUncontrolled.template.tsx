import { useState } from 'react';

import { RadioButton, RadioGroup, type RadioGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const renderOptions = () => (
  <>
    <RadioButton value="courier">Курьером</RadioButton>
    <RadioButton value="pickup">Самовывоз</RadioButton>
    <RadioButton value="post">Почтой</RadioButton>
  </>
);

export const RadioGroupControlledUncontrolledTemplate = (args: RadioGroupProps) => {
  const [controlledValue, setControlledValue] = useState('courier');

  return (
    <StoryDemoContainer $direction="column" $gap="40px">
      <StoryDemoDescription>
        Controlled-группа получает текущее значение через value. Родительский компонент хранит его в состоянии и
        обновляет в обработчике onChange.
      </StoryDemoDescription>
      <RadioGroup
        {...args}
        name="controlled-delivery"
        legend="Controlled RadioGroup"
        value={controlledValue}
        onChange={setControlledValue}
      >
        {renderOptions()}
      </RadioGroup>

      <StoryDemoDescription>
        Uncontrolled-группа получает только начальное значение через defaultValue.
      </StoryDemoDescription>
      <RadioGroup {...args} name="uncontrolled-delivery" legend="Uncontrolled RadioGroup" defaultValue="pickup">
        {renderOptions()}
      </RadioGroup>
    </StoryDemoContainer>
  );
};
