import styled from 'styled-components';

import { TagDot, type TagDotProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TagDotActiveAndPassiveTemplate = ({ onClick, ...args }: TagDotProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Тег с обработчиком <code>onClick</code> поддерживает нажатие и фокус с клавиатуры. Без обработчика тег пассивен.
    </StoryDemoDescription>
    <TagList>
      <TagDot {...args} onClick={onClick}>
        Активный тег
      </TagDot>
      <TagDot {...args}>Пассивный тег</TagDot>
    </TagList>
  </StoryDemoContainer>
);
