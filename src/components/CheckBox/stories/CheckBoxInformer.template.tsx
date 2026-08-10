import { ServiceInfoSolid } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import {
  CheckBox,
  SelectionControlInformer,
  SelectionControlLayout,
  type CheckBoxProps,
} from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { CHECK_BOX_DIMENSIONS } from '../constants';

const INFORMER_TEXT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';

const CheckBoxList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const CheckBoxInformerTemplate = (args: CheckBoxProps) => (
  <StoryDemoContainer>
    <CheckBoxList>
      {CHECK_BOX_DIMENSIONS.map((dimension) => (
        <SelectionControlLayout key={dimension}>
          <CheckBox {...args} dimension={dimension} extraText="Дополнительный текст">
            Размер {dimension.toUpperCase()}
          </CheckBox>
          {/* TODO: в дальнейшем заменить title на Hint. */}
          <SelectionControlInformer $dimension={dimension} title={INFORMER_TEXT} aria-label={INFORMER_TEXT}>
            <ServiceInfoSolid />
          </SelectionControlInformer>
        </SelectionControlLayout>
      ))}
    </CheckBoxList>
  </StoryDemoContainer>
);
