import { useState } from 'react';

import styled from 'styled-components';

import { Button, ButtonGroup } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Example = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SelfDisablingButton = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Button disabled={disabled} onClick={() => setDisabled(true)}>
      Отключить себя
    </Button>
  );
};

export const ButtonGroupChildDisabledTabStopTemplate = () => {
  const [revision, setRevision] = useState(0);

  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Перейдите через Tab с кнопки «До группы» на «Отключить себя» и активируйте её через Enter или Space. Затем
        нажмите «До группы» и снова Tab: фокус должен перейти на оставшуюся доступную кнопку, а не на «После группы».
        Кнопка управляет disabled собственным состоянием, без обновления родителя и без дополнительной DOM-обёртки.
        «Сбросить» восстанавливает исходное состояние примера.
      </StoryDemoDescription>
      <Example>
        <Button>До группы</Button>
        <ButtonGroup key={revision} aria-label="Группа с самостоятельно отключающейся кнопкой">
          <SelfDisablingButton />
          <Button>Оставшаяся доступная</Button>
        </ButtonGroup>
        <Button>После группы</Button>
        <Button onClick={() => setRevision((value) => value + 1)}>Сбросить</Button>
      </Example>
    </StoryDemoContainer>
  );
};
