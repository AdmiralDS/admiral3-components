import { SystemStarSolid } from '@admiral-ds/admiral3-icons';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const TagTintedWithIconTemplate = (args: TagTintedProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Иконка передаётся через <code>iconsBefore</code>. Декоративная иконка скрыта от скринридера, поскольку смысл тега
      выражен текстом.
    </StoryDemoDescription>
    <TagTinted {...args} iconsBefore={<SystemStarSolid aria-hidden="true" focusable="false" />}>
      Избранное
    </TagTinted>
  </StoryDemoContainer>
);
