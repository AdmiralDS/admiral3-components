import { useState } from 'react';

import { ServiceHelpOutline } from '@admiral-ds/admiral3-icons';

import { Hint, Input, InputIconButton, type HintProps, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const HintInputTargetTemplate = (props: Omit<HintProps, 'targetElement'>) => {
  const [inputContainer, setInputContainer] = useState<HTMLDivElement | null>(null);
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ targetElement: inputContainer });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Иконка вопроса управляет видимостью Hint, а <code>targetElement</code> задаёт отдельный элемент позиционирования
        — контейнер Input. Наведение и фокус на самом поле не открывают и не удерживают Hint.
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
