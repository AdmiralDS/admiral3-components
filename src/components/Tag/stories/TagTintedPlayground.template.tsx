import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const TagTintedPlaygroundTemplate = (args: TagTintedProps) => {
  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        Тег — это метка, размечающая и каталогизирующая информацию для облегчения процесса поиска. При нажатии на тег
        загружаются все элементы, имеющие эту метку (опционально).
      </StoryDemoDescription>
      <StoryDemoDescription>
        Теги могут быть как активными (active) и служить, например, каталагизаторами, так и пассивными (passive), просто
        отображая принадлежность элемента к некоторой группе элементов имеющих общий признак.
      </StoryDemoDescription>
      <TagTinted {...args}>Tag</TagTinted>
    </StoryDemoContainer>
  );
};
