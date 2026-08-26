import styled from 'styled-components';

import { Skeleton } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const List = styled.div`
  display: grid;
  gap: 8px;
`;

export const SkeletonTextTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="40px">
      <StoryDemoDescription>
        Если вам нужен Skeleton для текстовых блоков и заголовков, следует учесть ряд рекомендаций. Размер скелетона по
        высоте должен быть равен размеру шрифта (а не высоте строки). Например, для текста размером 16px и высотой
        строки 24, размер скелетона будет 16px с межблочным расстоянием 8px. Такая разметка нужна для того, чтобы
        схематическое отображение текста не сливалось в одну сплошную форму.
      </StoryDemoDescription>
      <List>
        <Skeleton height="16px" width="320px" />
        <Skeleton height="16px" width="320px" />
        <Skeleton height="16px" width="320px" />
      </List>
    </StoryDemoContainer>
  );
};
