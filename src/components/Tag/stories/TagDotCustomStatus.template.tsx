import { TagDot, type TagDotProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const TagDotCustomStatusTemplate = (args: TagDotProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Пользовательские цвета задаются объектом в <code>status</code>.
    </StoryDemoDescription>
    <TagDot
      {...args}
      withBorder
      status={{
        background: {
          rest: 'var(--admiral-color-magenta-base-3-rest)',
          hover: 'var(--admiral-color-magenta-base-3-hover)',
          press: 'var(--admiral-color-magenta-base-3-press)',
        },
        border: 'var(--admiral-color-magenta-stroke-2-rest)',
        dotColor: 'var(--admiral-color-magenta-base-1-rest)',
        textColor: 'var(--admiral-color-magenta-text-1-rest)',
      }}
    >
      Magenta
    </TagDot>
  </StoryDemoContainer>
);
