import { RadioButton, RadioGroup, type RadioGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const renderOptions = () => (
  <>
    <RadioButton value="courier">Курьером</RadioButton>
    <RadioButton value="pickup">Самовывоз</RadioButton>
    <RadioButton value="post">Почтой</RadioButton>
  </>
);

export const RadioGroupSizesTemplate = (args: RadioGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="40px">
    <RadioGroup {...args} name="delivery-m" legend="Выберите способ доставки" dimension="m">
      {renderOptions()}
    </RadioGroup>
    <RadioGroup {...args} name="delivery-s" legend="Выберите способ доставки" dimension="s">
      {renderOptions()}
    </RadioGroup>
    <RadioGroup {...args} name="delivery-xs" legend="Выберите способ доставки" dimension="xs" disabled>
      {renderOptions()}
    </RadioGroup>
  </StoryDemoContainer>
);
