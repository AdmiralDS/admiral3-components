import styled from 'styled-components';

import { Button, ButtonGroup, type ButtonGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { BUTTON_GROUP_APPEARANCES } from '../constants';

const Example = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

export const ButtonGroupStatesTemplate = (args: ButtonGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Hover, press и focus проверяются взаимодействием с отдельной Button. Disabled, inactive и loading задаются каждой
      кнопке независимо.
    </StoryDemoDescription>
    {BUTTON_GROUP_APPEARANCES.map((appearance) => (
      <Example key={appearance}>
        <StoryDemoDescription>{appearance}</StoryDemoDescription>
        <ButtonGroup {...args} appearance={appearance} aria-label={`Состояния ${appearance}`}>
          <Button>Обычная</Button>
          <Button disabled>Disabled</Button>
          <Button inactive>Inactive</Button>
          <Button loading>Loading</Button>
        </ButtonGroup>
      </Example>
    ))}
  </StoryDemoContainer>
);
