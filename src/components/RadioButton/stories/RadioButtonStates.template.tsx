import styled from 'styled-components';

import { RadioButton, type RadioButtonProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const RadioButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RadioButtonStatesTemplate = (args: RadioButtonProps) => (
  <StoryDemoContainer>
    <RadioButtonList>
      <RadioButton {...args} name="radio-state-checked" defaultChecked>
        Checked
      </RadioButton>
      <RadioButton {...args} name="radio-state-not-checked">
        Not checked
      </RadioButton>
      <RadioButton {...args} name="radio-state-readonly-checked" defaultChecked readOnly>
        Checked readonly
      </RadioButton>
      <RadioButton {...args} name="radio-state-readonly-not-checked" readOnly>
        Not checked readonly
      </RadioButton>
      <RadioButton {...args} name="radio-state-disabled-checked" defaultChecked disabled>
        Checked disabled
      </RadioButton>
      <RadioButton {...args} name="radio-state-disabled-not-checked" disabled>
        Not checked disabled
      </RadioButton>
      <RadioButton {...args} name="radio-state-error" error>
        Not checked error
      </RadioButton>
    </RadioButtonList>
  </StoryDemoContainer>
);
