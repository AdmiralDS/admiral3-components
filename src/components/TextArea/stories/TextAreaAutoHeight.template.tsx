import { TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaAutoHeightTemplate = (args: TextAreaProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      При включении <code>autoHeight</code> поле растёт по мере ввода текста. По умолчанию начальная высота равна двум
      строкам. Минимальное количество строк задаётся через <code>minRows</code>, максимальное — через
      <code>maxRows</code>. После достижения максимальной высоты появляется скролл. Минимальную высоту можно установить
      от одной строки.
    </StoryDemoDescription>
    <StoryDemoItem>
      <TextArea aria-label="Текст" autoHeight minRows={2} maxRows={5} {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
