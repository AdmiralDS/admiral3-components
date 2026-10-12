import styled from 'styled-components';

import { Button, Hint, HintLabel, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Content = styled.div`
  display: flex;
  width: 288px;
  flex-direction: column;
  gap: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const HintClickTemplate = () => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Режим <code>triggerMode="click"</code> подходит для Hint с интерактивным содержимым. Подсказка открывается по
        клику, либо при активации триггера клавишей Enter или Space и закрывается по крестику, Escape, повторному клику
        по триггеру или клику снаружи.
      </StoryDemoDescription>
      <StoryDemoDescription>
        В примере используется нативный <code>button</code>, который уже доступен с клавиатуры. Если триггером служит
        ненативный интерактивный элемент, пользователь должен самостоятельно обеспечить его клавиатурную доступность —
        как минимум назначить <code>role="button"</code> и <code>tabIndex=&#123;0&#125;</code>. Хук обрабатывает Enter и
        Space, но не добавляет этим элементам роль и возможность получить фокус.
      </StoryDemoDescription>
      <Button {...triggerProps}>Показать подсказку</Button>
      {isVisible && (
        <Hint
          {...hintProps}
          hintStyles={{ style: { width: 320 } }}
          closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}
        >
          <Content>
            <HintLabel>Дополнительная информация</HintLabel>
            <div>Хинт закрывается по крестику, Escape, повторному клику по триггеру или клику снаружи.</div>
            <Actions>
              <Button dimension="xs" appearance="solid">
                Подробнее
              </Button>
            </Actions>
          </Content>
        </Hint>
      )}
    </StoryDemoContainer>
  );
};
