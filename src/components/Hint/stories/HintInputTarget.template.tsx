import { useState } from 'react';

import { ServiceHelpOutline } from '@admiral-ds/admiral3-icons';

import { Hint, Input, InputIconButton, type HintProps, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const HintInputTargetTemplate = (props: Omit<HintProps, 'targetElement'>) => {
  const [inputContainer, setInputContainer] = useState<HTMLDivElement | null>(null);
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({
    triggerMode: 'click',
    targetElement: inputContainer,
  });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Обычно Hint позиционируется относительно того же элемента, который управляет его видимостью. Параметр хука{' '}
        <code>targetElement</code> позволяет разделить эти роли: в примере компактная иконка вопроса остаётся триггером,
        а Hint позиционируется относительно контейнера Input. Такой подход нужен, когда подсказку открывает небольшой
        элемент внутри составного компонента, но визуально она должна быть выровнена по всему полю или другому крупному
        элементу интерфейса.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Переданный <code>targetElement</code> используется только для вычисления позиции. Наведение, фокус и клик по
        нему не открывают Hint и не удерживают его открытым — интерактивной зоной остаются только триггер и сам Hint.
        Поэтому для раздельных триггера и элемента позиционирования рекомендуется режим <code>triggerMode="click"</code>
        . В hover-режиме при движении указателя от иконки через область Input до Hint указатель покинет интерактивную
        зону и подсказка закроется до того, как пользователь сможет на неё перейти.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Вызов <code>useHint(&#123; triggerMode: 'click', targetElement: inputContainer &#125;)</code> сохраняет Hint
        открытым после активации и позволяет перейти к его содержимому.
      </StoryDemoDescription>
      <StoryDemoItem>
        <Input
          aria-label="Логин"
          placeholder="Введите логин"
          containerRef={setInputContainer}
          iconsAfter={
            <InputIconButton {...triggerProps} preventFocus aria-label="Требования к логину">
              <ServiceHelpOutline aria-hidden />
            </InputIconButton>
          }
        />
        {isVisible && <Hint {...props} {...hintProps} />}
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
