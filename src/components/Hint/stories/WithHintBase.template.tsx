import { Button, withHint, type WithHintProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const ButtonWithHint = withHint(Button);

export const WithHintBaseTemplate = (props: WithHintProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      <code>withHint</code> можно использовать с Button: компонент уже принимает <code>ref</code> и передаёт его
      корневой кнопке. Переключите <code>triggerMode</code> в Controls, чтобы сравнить открытие по наведению и клику.
    </StoryDemoDescription>
    <ButtonWithHint {...props}>Открыть Hint</ButtonWithHint>
  </StoryDemoContainer>
);
