import { TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaClearTemplate = (args: TextAreaProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Иконка очистки является опциональной и включается через <code>showClearIcon</code>. Она появляется при наличии
      текста в поле. Очистка и копирование используются по отдельности: при включении <code>showCopyIcon</code> кнопка
      очистки не отображается.
    </StoryDemoDescription>
    <StoryDemoItem>
      <TextArea aria-label="Текст" showClearIcon defaultValue="Текст для очистки" {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
