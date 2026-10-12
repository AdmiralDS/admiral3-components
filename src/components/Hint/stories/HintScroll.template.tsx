import styled from 'styled-components';

import { Button, Hint, HintLabel, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HintScrollTemplate = () => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        По умолчанию высота Hint ограничена 320 пикселями. Если содержимое не помещается, прокручивается внутренняя
        область, а кнопка закрытия остаётся закреплённой в правом верхнем углу. Ширину и более строгое ограничение
        высоты можно задать через <code>hintStyles</code>; в этом примере через него установлена только ширина 320
        пикселей, а максимальная высота остаётся стандартной.
      </StoryDemoDescription>
      <Button {...triggerProps}>Показать длинную подсказку</Button>
      {isVisible && (
        <Hint
          {...hintProps}
          hintStyles={{ style: { width: 320 } }}
          closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}
        >
          <Content>
            <HintLabel>Условия обслуживания</HintLabel>
            <div>
              Хинт ограничен по высоте. Если содержимое не помещается, прокручивается только внутренняя область.
            </div>
            <div>
              Кнопка закрытия остаётся на месте и визуально располагается поверх scroll-зоны. Правый отступ текста
              учитывает размер кнопки.
            </div>
            <div>
              Дополнительный текст делает содержимое достаточно длинным, чтобы продемонстрировать вертикальную прокрутку
              и максимальную высоту компонента.
            </div>
            <div>
              При прокрутке заголовок и текст перемещаются вместе, а крестик остаётся закреплённым в правом верхнем
              углу.
            </div>
          </Content>
        </Hint>
      )}
    </StoryDemoContainer>
  );
};
