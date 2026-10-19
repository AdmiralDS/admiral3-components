import styled from 'styled-components';

import { Button, Hint, type HintProps, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Examples = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
`;

export const HintPositionTemplate = (props: Omit<HintProps, 'targetElement'>) => {
  const automatic = useHint<HTMLButtonElement>();
  const top = useHint<HTMLButtonElement>();

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Без <code>hintPosition</code> компонент выбирает сторону автоматически. Заданное направление фиксирует сторону,
        но Hint может сместиться вдоль неё, чтобы остаться в пределах доступной области.
      </StoryDemoDescription>
      <StoryDemoDescription>
        При ширине viewport до 640 px Hint автоматически использует мобильное представление: размещается сверху или
        снизу от целевого элемента и растягивается по ширине экрана с безопасными отступами. Поведение можно проверить,
        выбрав мобильный viewport в Storybook.
      </StoryDemoDescription>
      <Examples>
        <Button {...automatic.triggerProps}>Автоматическая позиция</Button>
        <Button {...top.triggerProps}>Позиция: top</Button>
      </Examples>
      {automatic.isVisible && (
        <Hint {...props} {...automatic.hintProps} hintPosition={undefined}>
          {props.children}
        </Hint>
      )}
      {top.isVisible && (
        <Hint {...props} {...top.hintProps} hintPosition="top">
          {props.children}
        </Hint>
      )}
    </StoryDemoContainer>
  );
};
