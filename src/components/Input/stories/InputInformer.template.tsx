import { useState } from 'react';

import { Input, InputIconInformer, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const INFORMER_LABEL = 'Дополнительная информация о поле ввода';
const INFORMER_TEXT = 'Укажите название, которое поможет быстро найти запись в списке.';

export const InputInformerTemplate = (args: InputProps) => {
  const [inputContainer, setInputContainer] = useState<HTMLDivElement | null>(null);

  return (
    <StoryDemoContainer $direction="column" $gap="16px">
      <StoryDemoDescription>
        Поле ввода с информером. Необходимо, если для правильного заполнения поля может потребоваться дополнительная
        информация.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Подсказка реализована с помощью компонента Hint. В качестве иконки в поле ввода используется иконка Help.
        Информер рекомендуется всегда оставлять активным, в том числе в состояниях <code>readOnly</code> и{' '}
        <code>disabled</code>.
      </StoryDemoDescription>
      <StoryDemoItem>
        <Input
          {...args}
          containerRef={setInputContainer}
          iconsAfter={
            <InputIconInformer
              aria-label={INFORMER_LABEL}
              renderContent={() => INFORMER_TEXT}
              hintTargetElement={inputContainer}
            />
          }
        />
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
