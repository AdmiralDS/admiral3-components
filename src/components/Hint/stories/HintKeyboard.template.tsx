import { useState } from 'react';

import styled from 'styled-components';

import { Button, Hint, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const HiddenButton = styled(Button)`
  display: none;
`;

const ClickCount = styled.output`
  font: inherit;
`;

export const HintLastTriggerTemplate = () => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Откройте этот пример отдельно в Canvas. Установите фокус на кнопку и нажмите Enter: фокус перейдёт на крестик
        Hint. Нажмите Tab. Подсказка должна закрыться, а фокус — вернуться на триггер, поскольку после него нет других
        доступных элементов. Потеря фокуса вместо возврата на кнопку означает ошибку навигации.
      </StoryDemoDescription>
      <Button {...triggerProps}>Последний триггер на странице</Button>
      {isVisible && (
        <Hint {...hintProps} closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}>
          После триггера нет других элементов для перехода по Tab.
        </Hint>
      )}
    </StoryDemoContainer>
  );
};

export const HintHiddenNextElementTemplate = () => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Установите фокус на триггер и откройте Hint клавишей Enter. Когда фокус находится на крестике, нажмите Tab.
        Подсказка должна закрыться, а фокус — перейти на кнопку «Следующая видимая кнопка». Между кнопками находится
        элемент с display: none, который не должен участвовать в навигации.
      </StoryDemoDescription>
      <Button {...triggerProps}>Триггер перед скрытой кнопкой</Button>
      <HiddenButton>Скрытая кнопка</HiddenButton>
      <Button>Следующая видимая кнопка</Button>
      {isVisible && (
        <Hint {...hintProps} closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}>
          При выходе из Hint скрытая кнопка должна быть пропущена.
        </Hint>
      )}
    </StoryDemoContainer>
  );
};

export const HintKeyboardActivationTemplate = () => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });
  const [clicks, setClicks] = useState(0);

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Нажмите кнопку мышью и проверьте счётчик вызовов onClick. Закройте Hint клавишей Escape, затем активируйте
        кнопку клавишей Enter. Повторите проверку с Space. При каждом способе активации Hint должен открываться, а
        счётчик — увеличиваться на один.
      </StoryDemoDescription>
      <Button {...triggerProps} onClick={() => setClicks((value) => value + 1)}>
        Показать подсказку и вызвать onClick
      </Button>
      <ClickCount aria-live="polite">Вызовов onClick: {clicks}</ClickCount>
      {isVisible && (
        <Hint {...hintProps} closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}>
          Сравните вызов onClick при активации мышью, Enter и Space.
        </Hint>
      )}
    </StoryDemoContainer>
  );
};
