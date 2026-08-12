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
`;

const RadioButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RadioButtonFieldsetReadOnlyTemplate = (args: RadioButtonProps) => (
  <StoryDemoContainer $direction="column" $gap="20px">
    <StoryDemoDescription>
      В режиме Read Only — все кнопки в группе должны быть в этом состоянии, нельзя, чтобы часть кнопок была
      интерактивна.
    </StoryDemoDescription>
    <Fieldset>
      <Legend>Выберите способ доставки</Legend>
      <RadioButtonList>
        <RadioButton {...args} name="readonly-delivery" value="courier" readOnly defaultChecked>
          Курьером
        </RadioButton>
        <RadioButton {...args} name="readonly-delivery" value="pickup" readOnly>
          Самовывоз
        </RadioButton>
        <RadioButton {...args} name="readonly-delivery" value="post" readOnly>
          Почтой
        </RadioButton>
      </RadioButtonList>
    </Fieldset>
  </StoryDemoContainer>
);
