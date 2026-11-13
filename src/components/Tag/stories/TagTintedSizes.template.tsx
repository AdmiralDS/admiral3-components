import styled from 'styled-components';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { TAG_DIMENSIONS } from '../constants';

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TagTintedSizesTemplate = (args: TagTintedProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>Доступны четыре размера: l, m, s и xs.</StoryDemoDescription>
    <TagList>
      {TAG_DIMENSIONS.map((dimension) => (
        <TagTinted key={dimension} {...args} dimension={dimension}>
          Размер {dimension.toUpperCase()}
        </TagTinted>
      ))}
    </TagList>
  </StoryDemoContainer>
);
