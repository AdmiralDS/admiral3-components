import styled from 'styled-components';

import { Button, ButtonGroup, type ButtonGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { BUTTON_GROUP_APPEARANCES, BUTTON_GROUP_COLOR_MODES } from '../constants';

const Matrix = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  gap: 24px 40px;
`;

const Example = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ButtonGroupAppearancesTemplate = (args: ButtonGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Внешний вид, цветовой режим и размер задаются на ButtonGroup и одинаково применяются ко всем Button.
    </StoryDemoDescription>
    <Matrix>
      {BUTTON_GROUP_APPEARANCES.flatMap((appearance) =>
        BUTTON_GROUP_COLOR_MODES.map((colorMode) => (
          <Example key={`${appearance}-${colorMode}`}>
            <StoryDemoDescription>
              {appearance} / {colorMode}
            </StoryDemoDescription>
            <ButtonGroup
              {...args}
              appearance={appearance}
              colorMode={colorMode}
              aria-label={`${appearance}, ${colorMode}`}
            >
              <Button>Первый</Button>
              <Button>Второй</Button>
              <Button>Третий</Button>
            </ButtonGroup>
          </Example>
        )),
      )}
    </Matrix>
  </StoryDemoContainer>
);
