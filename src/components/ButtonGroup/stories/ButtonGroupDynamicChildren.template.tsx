import { useState } from 'react';

import styled from 'styled-components';

import { Button, ButtonGroup } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Example = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SelfRemovingButton = () => {
  const [visible, setVisible] = useState(true);

  return visible ? <Button onClick={() => setVisible(false)}>Удалить себя</Button> : null;
};

const AddingButtons = () => {
  const [added, setAdded] = useState(false);

  return (
    <>
      <Button onClick={() => setAdded(true)}>Добавить кнопку</Button>
      {added && <Button>Добавленная кнопка</Button>}
    </>
  );
};

export const ButtonGroupDynamicChildrenTemplate = () => {
  const [resetIndex, setResetIndex] = useState(0);

  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <Example>
        <StoryDemoDescription>
          Удалите первую кнопку, затем нажмите «До группы» и <code>Tab</code>. Ожидается фокус на оставшейся кнопке; при
          ошибке фокус сразу переходит на «После группы».
        </StoryDemoDescription>
        <Actions>
          <Button>До группы</Button>
          <ButtonGroup key={resetIndex} aria-label="Удаление дочерней кнопки">
            <SelfRemovingButton />
            <Button>Оставшаяся кнопка</Button>
          </ButtonGroup>
          <Button>После группы</Button>
        </Actions>
      </Example>
      <Example>
        <StoryDemoDescription>
          Перейдите <code>Tab</code> на кнопку «До группы», оттуда также <code>Tab</code>, фокус попадает на «Добавить
          кнопку». На ней нажмите пробел, появится новая кнопка в группе. После этого снова нажмите <code>Tab</code>.
          Ожидается выход из группы; при ошибке второй <code>Tab</code> переводит фокус на добавленную кнопку.
        </StoryDemoDescription>
        <Actions>
          <Button>До группы</Button>
          <ButtonGroup key={resetIndex} aria-label="Добавление дочерней кнопки">
            <AddingButtons />
            <Button>Последняя кнопка</Button>
          </ButtonGroup>
          <Button>После группы</Button>
        </Actions>
      </Example>
      <Button onClick={() => setResetIndex((value) => value + 1)}>Сбросить примеры</Button>
    </StoryDemoContainer>
  );
};
