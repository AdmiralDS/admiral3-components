import styled from 'styled-components';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { TAG_STATUSES } from '../constants';

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TagTintedStatusesTemplate = (args: TagTintedProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <StoryDemoDescription>
      Свойство <code>status</code> определяет цвет фона тега.
    </StoryDemoDescription>
    <TagList>
      {TAG_STATUSES.map((status) => (
        <TagTinted key={status} {...args} status={status} onClick={() => null}>
          {status}
        </TagTinted>
      ))}
    </TagList>
  </StoryDemoContainer>
);
