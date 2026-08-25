import styled from 'styled-components';

import { Button } from '@admiral-ds/admiral3-components';

import { BUTTON_DIMENSIONS } from '../../Button/constants';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const List = styled.div<{ $direction?: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: flex-start;
  gap: 16px;
`;

export const SkeletonComponentsTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="40px" $withBackground={false}>
      <StoryDemoDescription>
        Ряд компонентов библиотеки предоставляют параметр <code>skeleton</code> для отображения компонента с
        соответствующей анимацией и состоянием загрузки. Например, компонент <code>Button</code>:
      </StoryDemoDescription>
      <List>
        {BUTTON_DIMENSIONS.map((dimension) => (
          <List key={dimension} $direction="column">
            <span>Size {dimension.toUpperCase()}</span>
            <Button dimension={dimension} skeleton>
              Button
            </Button>
          </List>
        ))}
      </List>
      <StoryDemoDescription>
        Библиотека также предоставляет отдельный миксин <code>skeletonAnimationMixin</code>, который содержит в себе
        анимацию плавного изменения цвета. Данный миксин может быть полезен при встраивании анимации скелетона в уже
        готовые компоненты.
      </StoryDemoDescription>
    </StoryDemoContainer>
  );
};
