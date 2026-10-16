import styled from 'styled-components';

import { TagDot, type TagDotProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { TAG_DIMENSIONS } from '../constants';

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TagDotSizesTemplate = (args: TagDotProps) => (
  <StoryDemoContainer $withBackground={false}>
    <TagList>
      {TAG_DIMENSIONS.map((dimension) => (
        <TagDot key={dimension} {...args} dimension={dimension}>
          Размер {dimension.toUpperCase()}
        </TagDot>
      ))}
    </TagList>
  </StoryDemoContainer>
);
