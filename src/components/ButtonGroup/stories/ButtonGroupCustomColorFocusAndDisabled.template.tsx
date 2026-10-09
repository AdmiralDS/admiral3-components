import styled from 'styled-components';

import { Button, ButtonGroup } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Example = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

export const ButtonGroupCustomColorFocusAndDisabledTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Сравните две solid-группы. Во второй через colorConfig задан только тот же белый цвет текста. Перемещайте фокус
      клавишей Tab: контур фокуса должен оставаться видимым в обеих группах. Фон и цвет текста disabled-кнопок должны
      совпадать, поскольку пользовательские disabled-цвета не заданы.
    </StoryDemoDescription>
    <Example>
      <StoryDemoDescription>Без colorConfig</StoryDemoDescription>
      <ButtonGroup appearance="solid" colorMode="colored" aria-label="Группа без пользовательских цветов">
        <Button>Доступная</Button>
        <Button disabled>Disabled</Button>
      </ButtonGroup>
    </Example>
    <Example>
      <StoryDemoDescription>С colorConfig: только белый текст</StoryDemoDescription>
      <ButtonGroup
        appearance="solid"
        colorMode="colored"
        colorConfig={{ textColor: 'var(--admiral-color-neutral-text-static-white-1)' }}
        aria-label="Группа с пользовательским цветом"
      >
        <Button>Доступная</Button>
        <Button disabled>Disabled</Button>
      </ButtonGroup>
    </Example>
  </StoryDemoContainer>
);
