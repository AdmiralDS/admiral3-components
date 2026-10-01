import styled from 'styled-components';

import { Button, ButtonGroup, type ButtonGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { BUTTON_GROUP_DIMENSIONS } from '../constants';

const Example = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const Examples = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: max-content;
`;

export const ButtonGroupDimensionsTemplate = (args: ButtonGroupProps) => (
  <StoryDemoContainer>
    <Examples>
      {BUTTON_GROUP_DIMENSIONS.map((dimension) => (
        <Example key={dimension}>
          <StoryDemoDescription>Dimension {dimension.toUpperCase()}</StoryDemoDescription>
          <ButtonGroup {...args} dimension={dimension} aria-label={`Размер ${dimension}`}>
            <Button>Первый</Button>
            <Button>Второй</Button>
            <Button>Третий</Button>
          </ButtonGroup>
        </Example>
      ))}
    </Examples>
  </StoryDemoContainer>
);
