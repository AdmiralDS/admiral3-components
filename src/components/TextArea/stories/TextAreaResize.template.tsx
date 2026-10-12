import { TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaResizeTemplate = (args: TextAreaProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Опция <code>resize</code> позволяет изменять высоту поля по вертикали, перетягивая его за правый нижний угол. При
      изменении высоты контент страницы под полем сдвигается на величину изменения размера. Ограничения высоты задаются
      через <code>minRows</code> и <code>maxRows</code>: при достижении границы поле перестаёт изменять размер.
    </StoryDemoDescription>
    <StoryDemoItem>
      <TextArea aria-label="Текст" resize minRows={2} maxRows={8} {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
