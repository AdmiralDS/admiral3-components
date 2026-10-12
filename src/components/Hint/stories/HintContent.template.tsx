import styled from 'styled-components';

import { Button, Hint, HintLabel, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Examples = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  align-items: flex-start;
`;

const HintBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Example = ({ children, label }: React.PropsWithChildren<{ label: string }>) => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });

  return (
    <div>
      <Button {...triggerProps}>{label}</Button>
      {isVisible && (
        <Hint
          {...hintProps}
          closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}
          hintStyles={{ style: { width: 320 } }}
        >
          {children}
        </Hint>
      )}
    </div>
  );
};

export const HintContentTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="20px">
    <StoryDemoDescription>
      Hint может содержать простой текст, заголовок или интерактивные элементы. Для вариантов с действиями используйте
      открытие по клику, чтобы пользователь мог перейти с триггера внутрь подсказки.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Для оформления заголовка библиотека предоставляет компонент <code>HintLabel</code> с подходящей типографикой.
      Разместите его внутри Hint вместе с основным текстом; создавать отдельный стилизованный заголовок для стандартного
      сценария не требуется.
    </StoryDemoDescription>
    <Examples>
      <Example label="Текст">
        Всплывающая подсказка используется, когда информацию требуется раскрыть подробнее.
      </Example>
      <Example label="Заголовок и текст">
        <HintBody>
          <HintLabel>Заголовок</HintLabel>
          <div>Всплывающая подсказка используется, когда информацию требуется раскрыть подробнее.</div>
        </HintBody>
      </Example>
      <Example label="Заголовок, текст и кнопки">
        <HintBody>
          <HintLabel>Заголовок</HintLabel>
          <div>Всплывающая подсказка может содержать связанные с контекстом действия.</div>
          <Actions>
            <Button dimension="xs" appearance="solid">
              Подробнее
            </Button>
            <Button dimension="xs" appearance="outline">
              Отмена
            </Button>
          </Actions>
        </HintBody>
      </Example>
    </Examples>
  </StoryDemoContainer>
);
