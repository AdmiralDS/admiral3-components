import { TagDot, type TagDotProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const TagDotCustomStatusTemplate = (args: TagDotProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Пользовательские цвета задаются объектом в <code>status</code>.
    </StoryDemoDescription>
    <TagDot
      {...args}
      type="submit"
      withBorder
      status={{
        backgroundColor: {
          rest: 'var(--admiral-color-magenta-base-3-rest)',
          hover: 'var(--admiral-color-magenta-base-3-hover)',
          press: 'var(--admiral-color-magenta-base-3-press)',
        },
        borderColor: 'var(--admiral-color-magenta-stroke-2-rest)',
        dotAppearance: { backgroundColor: 'var(--admiral-color-magenta-base-1-rest)' },
        textColor: 'var(--admiral-color-magenta-text-1-rest)',
      }}
      onClick={() => null}
    >
      Magenta
    </TagDot>
  </StoryDemoContainer>
);
