import { ServiceInfoSolid } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import {
  RadioButton,
  SelectionControlInformer,
  SelectionControlLayout,
  type RadioButtonProps,
} from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { RADIO_BUTTON_DIMENSIONS } from '../constants';

const RadioButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const INFORMER_TEXT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';

export const RadioButtonInformerTemplate = (args: RadioButtonProps) => (
  <StoryDemoContainer>
    <RadioButtonList>
      {RADIO_BUTTON_DIMENSIONS.map((dimension) => (
        <SelectionControlLayout key={dimension}>
          <RadioButton {...args} name={`radio-informer-${dimension}`} dimension={dimension} extraText="Add text">
            Dimension — {dimension}
          </RadioButton>
          {/* TODO: в дальнейшем заменить title на Hint. */}
          <SelectionControlInformer $dimension={dimension} title={INFORMER_TEXT} aria-label={INFORMER_TEXT}>
            <ServiceInfoSolid />
          </SelectionControlInformer>
        </SelectionControlLayout>
      ))}
    </RadioButtonList>
  </StoryDemoContainer>
);
