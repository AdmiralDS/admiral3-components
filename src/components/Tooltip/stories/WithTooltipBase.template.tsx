import { Button, withTooltip, type WithTooltipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const ButtonWithTooltip = withTooltip(Button);

export const WithTooltipBaseTemplate = (props: WithTooltipProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      <code>withTooltip</code> можно использовать с готовым компонентом Button: он принимает <code>ref</code> и передаёт
      его корневому HTML-элементу. Наведите указатель на кнопку или установите на неё фокус с клавиатуры.
    </StoryDemoDescription>
    <ButtonWithTooltip {...props} renderContent={() => 'Tooltip добавлен к готовому компоненту Button.'}>
      Наведите указатель или установите фокус
    </ButtonWithTooltip>
  </StoryDemoContainer>
);
