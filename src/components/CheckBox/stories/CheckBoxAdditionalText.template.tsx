import styled from 'styled-components';

import { CheckBox, type CheckBoxProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { CHECK_BOX_DIMENSIONS } from '../constants';

const CheckBoxList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const CheckBoxAdditionalTextTemplate = (args: CheckBoxProps) => (
  <StoryDemoContainer>
    <CheckBoxList>
      {CHECK_BOX_DIMENSIONS.map((dimension) => (
        <CheckBox {...args} key={dimension} dimension={dimension} extraText="Дополнительный текст">
          Размер {dimension.toUpperCase()}
        </CheckBox>
      ))}
    </CheckBoxList>
  </StoryDemoContainer>
);
