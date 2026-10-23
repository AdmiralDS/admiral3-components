import styled from 'styled-components';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TagTintedActiveAndPassiveTemplate = ({ onClick, ...args }: TagTintedProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Тег с обработчиком <code>onClick</code> поддерживает нажатие и фокус с клавиатуры. Без обработчика тег пассивен.
    </StoryDemoDescription>
    <TagList>
      <TagTinted {...args} onClick={onClick}>
        Активный тег
      </TagTinted>
      <TagTinted {...args}>Пассивный тег</TagTinted>
    </TagList>
  </StoryDemoContainer>
);
