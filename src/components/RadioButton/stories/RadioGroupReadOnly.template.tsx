import { RadioButton, RadioGroup, type RadioGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const RadioGroupReadOnlyTemplate = (args: RadioGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="20px">
    <StoryDemoDescription>
      В режиме readOnly все RadioButton в группе сохраняют фокусируемость, но выбранное значение нельзя изменить.
    </StoryDemoDescription>
    <RadioGroup {...args} name="readonly-delivery" legend="Выберите способ доставки" defaultValue="courier" readOnly>
      <RadioButton value="courier">Курьером</RadioButton>
      <RadioButton value="pickup">Самовывоз</RadioButton>
      <RadioButton value="post">Почтой</RadioButton>
    </RadioGroup>
  </StoryDemoContainer>
);
