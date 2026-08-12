import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { RadioButton, type RadioButtonProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Fieldset = styled.fieldset`
  padding: 0;
  border: 0;
`;

const Legend = styled.legend`
  padding: 0;
  margin-bottom: 16px;
  ${textStyles.body.body1Long}
  fieldset[data-dimension='s'] & {
    ${textStyles.body.body2Long}
  }
  fieldset[data-dimension='xs'] & {
    ${textStyles.caption.caption1}
  }
  fieldset:disabled & {
    color: var(--admiral-color-neutral-text-disable-rest);
  }
`;

const RadioButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RadioButtonFieldsetTemplate = (args: RadioButtonProps) => (
  <StoryDemoContainer $direction="column" $gap="40px">
    <StoryDemoDescription>
      Переключатель нельзя использовать сам по себе: он должен отображаться в группе связанных переключателей.
    </StoryDemoDescription>
    <Fieldset>
      <Legend>Выберите способ доставки</Legend>
      <RadioButtonList>
        <RadioButton {...args} name="delivery-m" value="courier" defaultChecked>
          Курьером
        </RadioButton>
        <RadioButton {...args} name="delivery-m" value="pickup">
          Самовывоз
        </RadioButton>
        <RadioButton {...args} name="delivery-m" value="post">
          Почтой
        </RadioButton>
      </RadioButtonList>
    </Fieldset>
    <Fieldset data-dimension="s">
      <Legend>Выберите способ доставки</Legend>
      <RadioButtonList>
        <RadioButton {...args} name="delivery-s" value="courier" defaultChecked>
          Курьером
        </RadioButton>
        <RadioButton {...args} name="delivery-s" value="pickup">
          Самовывоз
        </RadioButton>
        <RadioButton {...args} name="delivery-s" value="post">
          Почтой
        </RadioButton>
      </RadioButtonList>
    </Fieldset>
    <Fieldset data-dimension="xs" disabled>
      <Legend>Выберите способ доставки</Legend>
      <RadioButtonList>
        <RadioButton {...args} name="delivery-xs" value="courier" defaultChecked>
          Курьером
        </RadioButton>
        <RadioButton {...args} name="delivery-xs" value="pickup">
          Самовывоз
        </RadioButton>
        <RadioButton {...args} name="delivery-xs" value="post">
          Почтой
        </RadioButton>
      </RadioButtonList>
    </Fieldset>
  </StoryDemoContainer>
);
