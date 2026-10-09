import styled from 'styled-components';

import { Button, ButtonGroup, type ButtonGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const KeyboardExample = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const BoundaryButton = styled.button`
  padding: 4px 8px;
`;

export const ButtonGroupKeyboardNavigationTemplate = (args: ButtonGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <StoryDemoDescription $textAlign="center">
      <code>Tab</code> переводит фокус на активную Button и следующим нажатием выводит его из группы. Стрелки{' '}
      <code>ArrowLeft</code> и <code>ArrowRight</code> перемещают фокус по кругу и пропускают disabled Button.{' '}
      <code>Home</code> и <code>End</code> переводят фокус на первую и последнюю доступную Button. <code>Enter</code> и{' '}
      <code>Space</code> запускают действие сфокусированной Button.
    </StoryDemoDescription>
    <KeyboardExample>
      <BoundaryButton type="button" data-testid="before-button-group">
        До группы
      </BoundaryButton>
      <ButtonGroup {...args} aria-label="Действия с документом" data-testid="button-group-keyboard">
        <Button data-testid="button-group-first">Сохранить</Button>
        <Button disabled data-testid="button-group-disabled">
          Архивировать
        </Button>
        <Button data-testid="button-group-last">Удалить</Button>
      </ButtonGroup>
      <BoundaryButton type="button" data-testid="after-button-group">
        После группы
      </BoundaryButton>
    </KeyboardExample>
  </StoryDemoContainer>
);
