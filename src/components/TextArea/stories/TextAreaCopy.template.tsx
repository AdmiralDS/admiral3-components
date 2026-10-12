import { TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaCopyTemplate = (args: TextAreaProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Если возможность копировать текст важна для сценария, включите <code>showCopyIcon</code>. Кнопка копирования видна
      только при наличии текста в поле. Копирование заменяет очистку: одновременно эти действия не отображаются. После
      успешного копирования подсказка «Скопировано» показывается в течение двух секунд.
    </StoryDemoDescription>
    <StoryDemoItem>
      <TextArea aria-label="Текст" showCopyIcon readOnly defaultValue="Текст для копирования" {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
