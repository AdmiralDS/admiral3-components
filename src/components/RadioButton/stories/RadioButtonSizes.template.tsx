import styled from 'styled-components';

import { RadioButton, type RadioButtonProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { RADIO_BUTTON_DIMENSIONS } from '../constants';

const RadioButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RadioButtonSizesTemplate = (args: RadioButtonProps) => (
  <StoryDemoContainer>
    <RadioButtonList>
      {RADIO_BUTTON_DIMENSIONS.map((dimension) => (
        <RadioButton {...args} key={dimension} name={`radio-size-${dimension}`} dimension={dimension}>
          Dimension — {dimension}
        </RadioButton>
      ))}
    </RadioButtonList>
  </StoryDemoContainer>
);
